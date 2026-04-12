# SSIEMS CSE Academic Portal Startup Script
# Usage: .\start-system.ps1

Write-Host "🚀 Starting SSIEMS CSE Academic Portal..." -ForegroundColor Green

# Start Backend Server
Write-Host "🔧 Starting Backend Server (FastAPI)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$(Get-Location)\backend'; uvicorn server:app --host 0.0.0.0 --port 8000" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server (React)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$(Get-Location)\frontend'; yarn start" -WindowStyle Normal

Write-Host "✅ GradeFlow System startup initiated!" -ForegroundColor Green
Write-Host "🌐 Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📚 API Documentation at: http://localhost:8000/docs" -ForegroundColor Cyan