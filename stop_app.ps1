Write-Host "Stopping Bookstore Application..." -ForegroundColor Yellow

# Kill all node.exe processes
taskkill /F /IM node.exe

Write-Host "All Node.js processes stopped." -ForegroundColor Green
