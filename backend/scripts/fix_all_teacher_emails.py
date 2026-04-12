import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

async def fix_all_teacher_emails():
    load_dotenv()
    
    client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
    db = client[os.getenv('DB_NAME')]
    
    print("\n" + "="*70)
    print("Fixing All Teacher Email Mismatches")
    print("="*70)
    
    # Mapping of user emails to their correct teacher profile emails
    # Based on the pattern, ssiems.org.in emails should be the primary ones
    email_updates = [
        ("drs@college.edu", "drs@ssiems.org.in"),  # Prof. Devkar R.S.
        ("jpk@college.edu", "pkj@ssiems.org.in"),  # Prof. Jadhav P.K. (note: PKJ not JPK)
    ]
    
    for old_email, new_email in email_updates:
        print(f"\nUpdating: {old_email}")
        print(f"       To: {new_email}")
        
        result = await db.teachers.update_one(
            {"email": old_email},
            {"$set": {"email": new_email}}
        )
        
        if result.modified_count > 0:
            teacher = await db.teachers.find_one({"email": new_email})
            if teacher:
                print(f"  ✅ Updated - {teacher.get('name')}")
        else:
            print(f"  ⚠️  No teacher found with {old_email}")
    
    print("\n" + "="*70)
    print("Verification - All Teacher Emails:")
    print("="*70)
    
    all_teachers = await db.teachers.find().to_list(100)
    for t in sorted(all_teachers, key=lambda x: x.get('email', '')):
        print(f"  {t.get('email'):30s} - {t.get('name')}")
    
    print("\n" + "="*70)
    print("User Accounts (Teacher Role):")
    print("="*70)
    
    teacher_users = await db.users.find({"role": "teacher"}).to_list(100)
    for u in sorted(teacher_users, key=lambda x: x.get('email', '')):
        print(f"  {u.get('email'):30s}")
    
    client.close()
    
    print("\n" + "="*70)
    print("✅ All teacher email updates complete!")
    print("="*70)

if __name__ == "__main__":
    asyncio.run(fix_all_teacher_emails())
