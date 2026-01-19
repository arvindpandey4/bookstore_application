Write-Host "Stopping Bookstore Application..." -ForegroundColor Yellow

# Kill all node.exe processes
Write-Host "Stopping Node.js processes..."
taskkill /F /IM node.exe
Write-Host "All Node.js processes stopped." -ForegroundColor Green

# Stop Docker Services
Write-Host "Stopping Docker Services..." -ForegroundColor Yellow
docker-compose down
Write-Host "Docker Services Stopepd." -ForegroundColor Green

Write-Host "Application Fully Stopped." -ForegroundColor Green
