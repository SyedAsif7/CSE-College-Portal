# GradeFlow Backend Restart Script
# This script restarts the backend server

Write-Host "🔄 Restarting GradeFlow Backend Server..." -ForegroundColor Yellow

# Find and stop existing backend processes
Write-Host "⏹️  Stopping existing backend processes..." -ForegroundColor Yellow
Get-Process | Where-Object {
    $_.ProcessName -eq "python" -and 
    $_.CommandLine -like "*uvicorn*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait for processes to stop
Start-Sleep -Seconds 2

# Start the backend server
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host "📍 Server will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 API Docs at: http://localhost:8000/docs" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn server:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Normal

Write-Host "✅ Backend server restart initiated!" -ForegroundColor Green
