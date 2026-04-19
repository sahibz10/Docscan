from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import pytesseract
import numpy as np
import razorpay
import uuid

app = FastAPI()

# Allow React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your React app's URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    db_user = users_db.get(user.email)
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": db_user}

# --- 2. OPENCV + TESSERACT EXTRACTION ENDPOINT ---
@app.post("/api/extract")
async def extract_text(file: UploadFile = File(...)):
    try:
        # Read image into OpenCV
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Preprocessing to improve OCR accuracy
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Apply thresholding to increase contrast
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

        # Extract text using Tesseract
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(thresh, config=custom_config)

        if not text.strip():
            text = "No readable text detected in this image."

        return {"extracted_text": text}
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

#