# PowerShell script to set up Node.js and npm for backend development
# Run this script to fix npm/node not recognized issues in backend

Write-Host "Setting up Node.js and npm for backend..." -ForegroundColor Green

# Add Node.js to PATH for this session
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Set aliases for Node.js and npm
Set-Alias -Name node -Value "C:\Program Files\nodejs\node.exe" -Scope Global
Set-Alias -Name npm -Value "C:\Program Files\nodejs\npm.cmd" -Scope Global

# Test if it works
Write-Host "Testing Node.js..." -ForegroundColor Yellow
$nodeVersion = & "C:\Program Files\nodejs\node.exe" --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

Write-Host "Testing npm..." -ForegroundColor Yellow
$npmVersion = & "C:\Program Files\nodejs\npm.cmd" --version
Write-Host "npm version: $npmVersion" -ForegroundColor Green

Write-Host "Testing node command directly..." -ForegroundColor Yellow
$nodeTest = node --version
Write-Host "Direct node command: $nodeTest" -ForegroundColor Green

Write-Host "Backend setup complete! You can now use 'node' and 'npm' commands." -ForegroundColor Green
Write-Host "To start the backend server, run: npm run dev" -ForegroundColor Cyan
Write-Host "To start in production mode, run: npm start" -ForegroundColor Cyan 