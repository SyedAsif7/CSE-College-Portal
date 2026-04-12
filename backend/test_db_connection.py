import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

async def test_connection():
    load_dotenv()
    
    mongo_url = os.getenv('MONGO_URL')
    db_name = os.getenv('DB_NAME')
    
    print(f"Testing MongoDB connection...")
    print(f"URL: {mongo_url[:30]}...")
    print(f"Database: {db_name}")
    
    try:
        client = AsyncIOMotorClient(
            mongo_url,
            serverSelectionTimeoutMS=5000
        )
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # Test database access
        db = client[db_name]
        collections = await db.list_collection_names()
        print(f"✅ Database accessible. Collections: {collections}")
        
        # Test assignments collection
        count = await db.assignments.count_documents({})
        print(f"✅ Assignments collection has {count} documents")
        
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
