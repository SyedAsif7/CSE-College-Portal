# GradeFlow Backend Restart Script
# This script restarts the backend server

Write-Host "[*] Restarting GradeFlow Backend Server..." -ForegroundColor Yellow

# Find and stop existing backend processes
Write-Host "[*] Stopping existing backend processes..." -ForegroundColor Yellow
Get-Process | Where-Object {
    $_.ProcessName -eq "python" -and 
    $_.CommandLine -like "*uvicorn*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

# Also stop any process listening on port 8000
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { 
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }

# Wait for processes to stop
Start-Sleep -Seconds 2

# Start the backend server
Write-Host "[*] Starting Backend Server..." -ForegroundColor Green
Write-Host "[+] Server will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "[+] API Docs at: http://localhost:8000/docs" -ForegroundColor Cyan

$backendCmd = if (Test-Path "$PSScriptRoot\.venv\Scripts\uvicorn.exe") {
    "cd '$PSScriptRoot\backend'; ..\.venv\Scripts\uvicorn.exe server:app --host 0.0.0.0 --port 8000 --reload"
} else {
    "cd '$PSScriptRoot\backend'; uvicorn server:app --host 0.0.0.0 --port 8000 --reload"
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal

Write-Host "[+] Backend server restart initiated!" -ForegroundColor Green
