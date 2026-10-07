# GradeFlow Frontend Restart Script
# This script restarts the frontend development server

Write-Host "[*] Restarting GradeFlow Frontend Server..." -ForegroundColor Yellow

# Find and stop existing frontend processes (React dev server on port 3000)
Write-Host "[*] Stopping existing frontend processes..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { 
        Write-Host "   Stopping process $_" -ForegroundColor Gray
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }

# Wait for processes to stop
Start-Sleep -Seconds 2

# Start the frontend server
Write-Host "[*] Starting Frontend Server..." -ForegroundColor Green
Write-Host "[+] App will be available at: http://localhost:3000" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; yarn start" -WindowStyle Normal

Write-Host "[+] Frontend server restart initiated!" -ForegroundColor Green
Write-Host "[*] Note: Wait 30-60 seconds for the server to fully start" -ForegroundColor Yellow
