from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
from pdf2image import convert_from_bytes
import pytesseract
import numpy as np
import razorpay
import uuid
from pymongo import MongoClient
import bcrypt
import certifi

MONGO_URI="mongodb+srv://docscan_admin:mySecurePass123@myatlasclusteredu.veatt.mongodb.net/?retryWrites=true&w=majority"
# mongodb+srv://<db_username>:<db_password>@myatlasclusteredu.veatt.mongodb.net/?appName=myAtlasClusterEDU
try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client["docscan_db"]
    users_collection = db["users"]
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")


app = FastAPI()

# Allow React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set this to your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend API is running successfully!"}

# Also, add this to the very bottom of main.py so you can run it easily:


# Initialize Razorpay Client (Use your test keys here)
razorpay_client = razorpay.Client(auth=("YOUR_RAZORPAY_KEY_ID", "YOUR_RAZORPAY_SECRET"))

# Mock Database
# Replace the empty users_db = {} with this:
users_db = {
    "sahibsokhi108@gmail.com": {
        "name": "Sahib Sokhi", 
        "email": "sahibsokhi108@gmail.com", 
        "password": "password123", # Change to whatever you were typing
        "plan": "Pro", 
        "used": 0, 
        "total": 100
    }
}

class UserReg(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class PaymentRequest(BaseModel):
    amount: int
    email: str

# --- 1. AUTHENTICATION ENDPOINTS ---
@app.post("/api/register")
def register(user: UserReg):
    # Check if user already exists in the database
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash the password for security
    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    new_user = {
        "name": user.name, 
        "email": user.email, 
        "password": hashed_pw.decode('utf-8'), # Store the hash, not the plain text!
        "plan": "Free", 
        "used": 0, 
        "total": 10
    }
    
    # Insert into database
    users_collection.insert_one(new_user)
    
    # Clean up the object before sending it back to React
    new_user.pop("password", None) 
    new_user["_id"] = str(new_user["_id"]) 
    
    return {"message": "User registered successfully", "user": new_user}
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[user.email] = {
        "name": user.name, 
        "email": user.email, 
        "password": user.password, # In production, hash this using bcrypt!
        "plan": "Free", 
        "used": 0, 
        "total": 10
    }
    return {"message": "User registered successfully", "user": users_db[user.email]}

@app.post("/api/login")
def login(user: UserLogin):
    # Find the user by email
    db_user = users_collection.find_one({"email": user.email})
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        # Check if the provided password matches the hashed password in the database
        password_hash = db_user.get("password", "")
        # Handle both bcrypt hashed and plain text passwords for backward compatibility
        if password_hash.startswith("$2"):
            # It's a bcrypt hash
            if not bcrypt.checkpw(user.password.encode('utf-8'), password_hash.encode('utf-8')):
                raise HTTPException(status_code=401, detail="Invalid credentials")
        else:
            # Plain text comparison (for development/backward compatibility)
            if user.password != password_hash:
                raise HTTPException(status_code=401, detail="Invalid credentials")
    except ValueError as e:
        # bcrypt checkpw raised an error
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Clean up the object before sending it back
    db_user.pop("password", None)
    db_user["_id"] = str(db_user["_id"])
    
    return {"message": "Login successful", "user": db_user}

# --- 2. OPENCV + TESSERACT EXTRACTION ENDPOINT ---
@app.post("/api/extract")
async def extract_text(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        extracted_text = ""
        filename = file.filename.lower()

        # Handle PDF Documents
        if filename.endswith(".pdf"):
            images = convert_from_bytes(contents)
            for img in images:
                # Convert PIL Image to OpenCV Format
                open_cv_image = np.array(img)
                open_cv_image = open_cv_image[:, :, ::-1].copy() # Convert RGB to BGR
                
                # Preprocess and Extract
                gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
                _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
                extracted_text += pytesseract.image_to_string(thresh, config=r'--oem 3 --psm 6') + "\n\n"
                
        # Handle Standard Images (JPG, PNG, WEBP, etc.)
        else:
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise HTTPException(status_code=400, detail="Unsupported file format.")
                
            # Preprocess and Extract
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
            extracted_text = pytesseract.image_to_string(thresh, config=r'--oem 3 --psm 6')

        if not extracted_text.strip():
            extracted_text = "No readable text detected in this document."

        return {"extracted_text": extracted_text.strip()}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# --- 3. RAZORPAY ORDER CREATION ---
@app.post("/api/create-order")
def create_order(req: PaymentRequest):
    try:
        # Amount must be in the smallest currency unit (paise for INR, cents for USD)
        # E.g., $12.00 = 1200 cents
        order_amount = req.amount * 100 
        order_currency = "USD"
        
        razorpay_order = razorpay_client.order.create(dict(
            amount=order_amount,
            currency=order_currency,
            receipt=str(uuid.uuid4()),
            payment_capture='0'
        ))
        return razorpay_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

class UpgradeRequest(BaseModel):
    email: str
    plan: str

@app.post("/api/upgrade-plan")
def upgrade_plan(req: UpgradeRequest):
    # Find the user and update their plan and scan limits in MongoDB
    result = users_collection.update_one(
        {"email": req.email},
        {"$set": {
            "plan": req.plan,
            "total": 100 if req.plan == "Pro" else 1000 # Give 100 scans for Pro, 1000 for Enterprise
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="User not found or plan already set")
        
    # Fetch the updated user to return to React
    updated_user = users_collection.find_one({"email": req.email})
    updated_user.pop("password", None)
    updated_user["_id"] = str(updated_user["_id"])
    
    return {"message": "Plan upgraded successfully", "user": updated_user}