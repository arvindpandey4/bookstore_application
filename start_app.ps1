Write-Host "Starting Bookstore Application..." -ForegroundColor Green

# Start Backend in a new window
Write-Host "Launching Backend Server in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a few seconds for backend to initialize
Start-Sleep -Seconds 2

# Start Frontend in a new window
Write-Host "Launching Frontend Client in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "Application Started!" -ForegroundColor Green
Write-Host "You can access the application at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API is running at:         http://localhost:5000" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan
