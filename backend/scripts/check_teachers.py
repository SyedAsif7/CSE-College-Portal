import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

async def check_teachers():
    load_dotenv()
    
    client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
    db = client[os.getenv('DB_NAME')]
    
    teachers = await db.teachers.find().to_list(100)
    print(f'\nTeachers found: {len(teachers)}')
    print('=' * 60)
    
    for t in teachers:
        print(f"Name: {t.get('name')}")
        print(f"Email: {t.get('email')}")
        print(f"ID: {t.get('id')}")
        print('-' * 60)
    
    # Also check users
    users = await db.users.find({"role": "teacher"}).to_list(100)
    print(f'\nTeacher user accounts found: {len(users)}')
    print('=' * 60)
    
    for u in users:
        print(f"Email: {u.get('email')}")
        print(f"Role: {u.get('role')}")
        print('-' * 60)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_teachers())
