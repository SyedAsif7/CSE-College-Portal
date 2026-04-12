import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

async def update_teacher_email():
    load_dotenv()
    
    client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
    db = client[os.getenv('DB_NAME')]
    
    print("\n" + "="*70)
    print("Updating Teacher Email Address")
    print("="*70)
    
    # Update Prof. Bais P.G. email from college.edu to ssiems.org.in
    old_email = "bpg@college.edu"
    new_email = "bpg@ssiems.org.in"
    
    print(f"\nUpdating: {old_email}")
    print(f"       To: {new_email}")
    
    result = await db.teachers.update_one(
        {"email": old_email},
        {"$set": {"email": new_email}}
    )
    
    if result.modified_count > 0:
        print(f"\n✅ Successfully updated teacher email!")
        
        # Verify the update
        teacher = await db.teachers.find_one({"email": new_email})
        if teacher:
            print(f"\nVerified teacher profile:")
            print(f"  Name: {teacher.get('name')}")
            print(f"  Email: {teacher.get('email')}")
            print(f"  ID: {teacher.get('id')}")
            print(f"  Subjects: {len(teacher.get('subject_ids', []))}")
    else:
        print(f"\n❌ No teacher found with email {old_email}")
    
    print("\n" + "="*70)
    
    # Also check if we need to update other teachers
    print("\nChecking for other teachers that might need email updates...")
    print("\nTeachers with @college.edu emails:")
    college_teachers = await db.teachers.find({"email": {"$regex": "college\\.edu"}}).to_list(100)
    for t in college_teachers:
        print(f"  - {t.get('name')}: {t.get('email')}")
    
    print("\nUser accounts with @ssiems.org.in emails (teacher role):")
    ssiems_users = await db.users.find({
        "email": {"$regex": "ssiems\\.org\\.in"},
        "role": "teacher"
    }).to_list(100)
    for u in ssiems_users:
        print(f"  - {u.get('email')}")
    
    client.close()
    
    print("\n" + "="*70)
    print("✅ Email update complete!")
    print("="*70)

if __name__ == "__main__":
    asyncio.run(update_teacher_email())
