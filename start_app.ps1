Write-Host "Starting Bookstore Application..." -ForegroundColor Green

# Start Docker Services
Write-Host "Starting Docker Services (Redis & RabbitMQ)..." -ForegroundColor Yellow
docker-compose up -d

# Check if Docker started successfully (Optional basics)
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Docker Compose failed to start. Ensure Docker Desktop is running." -ForegroundColor Red
}
else {
    Write-Host "Docker Services Started. Waiting 20s for services to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 20
}

# Start Backend in a new window
Write-Host "Launching Backend Server in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a few seconds for backend to initialize
Start-Sleep -Seconds 5

# Start Frontend in a new window
Write-Host "Launching Frontend Client in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "Application Started!" -ForegroundColor Green
Write-Host "You can access the application at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API is running at:         http://localhost:5000" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan
