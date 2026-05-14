#!/usr/bin/env python3
"""
Minimal MongoDB Atlas connection test
This script only requires pymongo and certifi
"""
import sys
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

print("=" * 60)
print("MongoDB Atlas Connection Test")
print("=" * 60)

try:
    from pymongo import MongoClient
    import certifi
    
    mongo_uri = os.getenv("MONGO_URI")
    
    if not mongo_uri:
        print("❌ ERROR: MONGO_URI not found in .env file")
        sys.exit(1)
    
    print(f"\n📝 Connection String: {mongo_uri[:50]}...")
    print("\n🔄 Attempting to connect to MongoDB Atlas...\n")
    
    # Attempt connection
    client = MongoClient(mongo_uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
    
    # Verify connection with server info
    server_info = client.server_info()
    print(f"✅ Connected to MongoDB successfully!")
    print(f"   Server Version: {server_info.get('version', 'Unknown')}")
    
    # Check database
    db = client["docscan_db"]
    collections = db.list_collection_names()
    print(f"   Database: docscan_db")
    print(f"   Collections: {collections if collections else 'None yet'}")
    
    print("\n" + "=" * 60)
    print("✅ MongoDB Atlas is working correctly!")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ Connection Failed!")
    print(f"   Error: {e}")
    print("\n" + "=" * 60)
    print("Troubleshooting:")
    print("1. Check MongoDB URI in .env file")
    print("2. Verify credentials are correct")
    print("3. Add your IP to MongoDB Atlas Network Access")
    print("4. Check internet connectivity")
    print("=" * 60)
    sys.exit(1)
