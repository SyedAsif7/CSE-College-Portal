import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

async def add_teacher_email_alias():
    load_dotenv()
    
    client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
    db = client[os.getenv('DB_NAME')]
    
    # Check current teachers with ssiems.org.in emails
    print("\nSearching for teachers with ssiems.org.in emails in users collection...")
    users = await db.users.find({"email": {"$regex": "ssiems\\.org\\.in"}}).to_list(100)
    
    print(f"\nFound {len(users)} user(s) with @ssiems.org.in emails:")
    for u in users:
        print(f"  - {u.get('email')} (role: {u.get('role')})")
    
    # Find the teacher with bpg@college.edu
    print("\n\nSearching for teacher with bpg@college.edu...")
    teacher = await db.teachers.find_one({"email": "bpg@college.edu"})
    
    if teacher:
        print(f"✅ Found teacher: {teacher.get('name')}")
        print(f"   Current email: {teacher.get('email')}")
        print(f"   ID: {teacher.get('id')}")
        
        # Option 1: Update the email to ssiems.org.in
        # Option 2: Create a duplicate entry with ssiems.org.in email
        
        print("\n\nWhat would you like to do?")
        print("1. Update bpg@college.edu to bpg@ssiems.org.in")
        print("2. Create a new teacher entry for bpg@ssiems.org.in")
        print("3. Show all available options")
        
        # For now, let's just show what we found
        print("\n\nCurrent teacher data:")
        import json
        print(json.dumps({
            "id": teacher.get("id"),
            "name": teacher.get("name"),
            "email": teacher.get("email"),
            "subject_ids": teacher.get("subject_ids", [])
        }, indent=2))
    else:
        print("❌ Teacher with bpg@college.edu not found")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(add_teacher_email_alias())
