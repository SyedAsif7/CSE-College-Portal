import asyncio
import os
import io
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

async def add_sample_assignments():
    load_dotenv()
    
    client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
    db = client[os.getenv('DB_NAME')]
    fs_bucket = AsyncIOMotorGridFSBucket(db, bucket_name="answer_sheets")
    
    print("\n" + "="*70)
    print("Adding Sample Assignments")
    print("="*70)
    
    # Sample assignments data
    sample_assignments = [
        {
            "prn": "202301001",
            "class": "SY-CSE",
            "subject": "Discrete Mathematics",
            "file_name": "assignment_1_dm.pdf",
            "grade": "",
            "remark": ""
        },
        {
            "prn": "202301002",
            "class": "SY-CSE",
            "subject": "Discrete Mathematics",
            "file_name": "assignment_2_dm.pdf",
            "grade": "",
            "remark": ""
        },
        {
            "prn": "202301003",
            "class": "SY-CSE",
            "subject": "Data Structures",
            "file_name": "assignment_1_ds.pdf",
            "grade": "",
            "remark": ""
        },
        {
            "prn": "202301004",
            "class": "TY-CSE",
            "subject": "Database Management Systems",
            "file_name": "assignment_1_dbms.pdf",
            "grade": "A",
            "remark": "Excellent work!"
        },
        {
            "prn": "202301005",
            "class": "TY-CSE",
            "subject": "Database Management Systems",
            "file_name": "assignment_2_dbms.pdf",
            "grade": "B+",
            "remark": "Good, but needs improvement in normalization"
        },
        {
            "prn": "202301006",
            "class": "SY-CSE",
            "subject": "Engineering Mathematics",
            "file_name": "assignment_1_em.pdf",
            "grade": "",
            "remark": ""
        }
    ]
    
    print(f"\nAdding {len(sample_assignments)} sample assignments...\n")
    
    for i, assignment in enumerate(sample_assignments, 1):
        # Create a simple PDF-like file (just a placeholder)
        pdf_content = f"""Assignment Submission
========================
PRN: {assignment['prn']}
Class: {assignment['class']}
Subject: {assignment['subject']}
Date: {datetime.now(timezone.utc).isoformat()}

This is a sample assignment file for testing purposes.
""".encode('utf-8')
        
        # Upload file to GridFS
        file_id = await fs_bucket.upload_from_stream(
            assignment['file_name'],
            io.BytesIO(pdf_content),
            metadata={
                "prn": assignment['prn'],
                "subject": assignment['subject'],
                "class": assignment['class']
            }
        )
        
        # Save assignment metadata
        assignment_doc = {
            "_id": str(file_id),
            "prn": assignment['prn'],
            "class": assignment['class'],
            "subject": assignment['subject'],
            "fileName": assignment['file_name'],
            "grade": assignment['grade'],
            "remark": assignment['remark'],
            "uploadedAt": datetime.now(timezone.utc).isoformat()
        }
        
        await db.assignments.insert_one(assignment_doc)
        print(f"✅ {i}. {assignment['prn']} - {assignment['subject']} ({assignment['class']})")
    
    # Verify
    total = await db.assignments.count_documents({})
    print(f"\n{'='*70}")
    print(f"✅ Successfully added {len(sample_assignments)} sample assignments")
    print(f"📊 Total assignments in database: {total}")
    print(f"{'='*70}")
    
    client.close()

if __name__ == "__main__":
    from motor.motor_asyncio import AsyncIOMotorGridFSBucket
    asyncio.run(add_sample_assignments())
