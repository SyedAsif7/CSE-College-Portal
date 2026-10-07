FROM python:3.11-slim
WORKDIR /app

# Install system dependencies for packages like bcrypt/cryptography
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy backend source code
COPY backend/ /app/

# Default Environment variables (overridden by Render runtime env)
ENV MONGO_URL="mongodb://mongo:27017" \
    DB_NAME="exam-management" \
    JWT_SECRET="change_this_secret" \
    CORS_ORIGINS="*"

EXPOSE 8000

# Bind dynamically to Render's $PORT or fallback to 8000
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}"]
