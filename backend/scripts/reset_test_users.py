"""
Script to delete old test users and recreate them with correct password_hash field
"""
import asyncio
from pathlib import Path
from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def main():
    try:
        print("\n🗑️  Removing old test users with 'password' field...\n")
        
        # Delete users that have 'password' field instead of 'password_hash'
        test_emails = [
            "admin@ssiems.org.in",
            "bpg@ssiems.org.in",
            "drs@ssiems.org.in",
            "pkj@ssiems.org.in",
            "student1@ssiems.org.in",
            "student2@ssiems.org.in",
            "student3@ssiems.org.in"
        ]
        
        for email in test_emails:
            result = await db.users.delete_one({"email": email})
            if result.deleted_count > 0:
                print(f"  ✅ Deleted: {email}")
            else:
                print(f"  ⚠️  Not found: {email}")
        
        print("\n✅ Old test users removed!")
        print("\n🔄 Now run: python scripts/seed_test_users.py")
        print("   This will create users with the correct 'password_hash' field\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())

