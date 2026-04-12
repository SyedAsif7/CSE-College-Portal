"""
Script to create test user accounts for GradeFlow System
Run this to populate the database with test credentials
"""
import asyncio
from pathlib import Path
from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
from datetime import datetime

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def hash_password(password: str) -> str:
    """Hash a password for storing"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def create_user(email: str, password: str, name: str, role: str, extra_data: dict = None):
    """Create a user account"""
    try:
        # Check if user already exists
        existing = await db.users.find_one({"email": email})
        if existing:
            print(f"  ⚠️  User already exists: {email}")
            return existing
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Create user document
        user_doc = {
            "email": email,
            "password_hash": hashed_password,
            "name": name,
            "role": role,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if extra_data:
            user_doc.update(extra_data)
        
        # Insert user
        result = await db.users.insert_one(user_doc)
        print(f"  ✅ Created {role}: {name} ({email}) - Password: {password}")
        return result.inserted_id
        
    except Exception as e:
        print(f"  ❌ Error creating user {email}: {e}")
        return None

async def seed_test_users():
    """Create test users for all roles"""
    print("\n🔐 Seeding Test Users...\n")
    
    # Admin Users
    print("📋 Admin Accounts:")
    await create_user(
        email="admin@ssiems.org.in",
        password="admin123",
        name="System Admin",
        role="admin"
    )
    print()
    
    # Teacher Users
    print("👨‍🏫 Teacher Accounts:")
    await create_user(
        email="bpg@ssiems.org.in",
        password="teacher123",
        name="Bais P. G.",
        role="teacher",
        extra_data={
            "initials": "BPG",
            "subject_ids": [],
            "phone": "+91 9876543210"
        }
    )
    await create_user(
        email="drs@ssiems.org.in",
        password="teacher123",
        name="Devkar R. S.",
        role="teacher",
        extra_data={
            "initials": "DRS",
            "subject_ids": [],
            "phone": "+91 9876543211"
        }
    )
    await create_user(
        email="pkj@ssiems.org.in",
        password="teacher123",
        name="Jadhav P.K.",
        role="teacher",
        extra_data={
            "initials": "PKJ",
            "subject_ids": [],
            "phone": "+91 9876543212"
        }
    )
    print()
    
    # Student Users
    print("👨‍🎓 Student Accounts:")
    await create_user(
        email="student1@ssiems.org.in",
        password="student123",
        name="Test Student 1",
        role="student",
        extra_data={
            "roll_number": "2024SYCSE001",
            "class_name": "SY-CSE",
            "phone": "+91 9876543220"
        }
    )
    await create_user(
        email="student2@ssiems.org.in",
        password="student123",
        name="Test Student 2",
        role="student",
        extra_data={
            "roll_number": "2024TYCSE001",
            "class_name": "TY-CSE",
            "phone": "+91 9876543221"
        }
    )
    await create_user(
        email="student3@ssiems.org.in",
        password="student123",
        name="Test Student 3",
        role="student",
        extra_data={
            "roll_number": "2024BECSE001",
            "class_name": "BE-CSE",
            "phone": "+91 9876543222"
        }
    )
    print()

async def main():
    try:
        print("=" * 60)
        print("🚀 GradeFlow System - Test User Seeder")
        print("=" * 60)
        
        await seed_test_users()
        
        # List all users
        print("\n" + "=" * 60)
        print("📊 Current Users in Database:")
        print("=" * 60)
        users = await db.users.find({}, {"_id": 0, "email": 1, "role": 1, "name": 1}).to_list(length=100)
        for user in users:
            print(f"  • {user.get('name')} | {user.get('email')} | {user.get('role')}")
        
        print("\n" + "=" * 60)
        print("✅ Test user seeding complete!")
        print("📝 See TEST_CREDENTIALS.md for login details")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
