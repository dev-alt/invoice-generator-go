# PowerShell wrapper for WSL development scripts
# Run this from Windows PowerShell to manage your development environment

param(
    [Parameter(Position=0)]
    [ValidateSet('setup', 'start', 'stop', 'restart', 'check', 'logs', 'backend', 'frontend', 'help')]
    [string]$Command = 'help'
)

function Show-Help {
    Write-Host ""
    Write-Host "Invoice Generator - Development Environment (WSL)" -ForegroundColor Cyan
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 <command>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  setup      - One-time setup (install dependencies)" -ForegroundColor White
    Write-Host "  start      - Start all services" -ForegroundColor White
    Write-Host "  stop       - Stop all services" -ForegroundColor White
    Write-Host "  restart    - Restart all services" -ForegroundColor White
    Write-Host "  check      - Check status of services" -ForegroundColor White
    Write-Host "  logs       - View application logs" -ForegroundColor White
    Write-Host "  backend    - Start backend only (foreground)" -ForegroundColor White
    Write-Host "  frontend   - Start frontend only (foreground)" -ForegroundColor White
    Write-Host "  help       - Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\dev.ps1 setup      # First time setup"
    Write-Host "  .\dev.ps1 start      # Start development"
    Write-Host "  .\dev.ps1 check      # Check service status"
    Write-Host "  .\dev.ps1 stop       # Stop services"
    Write-Host ""
    Write-Host "Access URLs:" -ForegroundColor Yellow
    Write-Host "  Frontend:  http://localhost:3000"
    Write-Host "  Backend:   http://localhost:8080"
    Write-Host ""
}

function Invoke-WSLScript {
    param(
        [string]$ScriptName
    )
    
    Write-Host "Running $ScriptName in WSL..." -ForegroundColor Cyan
    
    # Change to project directory and run script
    wsl bash -c "cd /root/projects/invoice-generator-go && chmod +x scripts/*.sh && ./scripts/$ScriptName"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Script failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

switch ($Command) {
    'setup' {
        Write-Host ""
        Write-Host "=== Initial Setup ===" -ForegroundColor Green
        Write-Host "This will install all dependencies in WSL" -ForegroundColor Yellow
        Write-Host ""
        Invoke-WSLScript "dev-setup.sh"
    }
    'start' {
        Write-Host ""
        Write-Host "=== Starting Development Environment ===" -ForegroundColor Green
        Invoke-WSLScript "dev-start.sh"
        Write-Host ""
        Write-Host "Services started! Access at:" -ForegroundColor Green
        Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor Cyan
        Write-Host "  Backend:   http://localhost:8080" -ForegroundColor Cyan
        Write-Host ""
    }
    'stop' {
        Write-Host ""
        Write-Host "=== Stopping Services ===" -ForegroundColor Yellow
        Invoke-WSLScript "dev-stop.sh"
    }
    'restart' {
        Write-Host ""
        Write-Host "=== Restarting Services ===" -ForegroundColor Yellow
        Invoke-WSLScript "dev-restart.sh"
    }
    'check' {
        Write-Host ""
        Invoke-WSLScript "dev-check.sh"
    }
    'logs' {
        Write-Host ""
        Write-Host "=== Viewing Logs ===" -ForegroundColor Cyan
        Invoke-WSLScript "dev-logs.sh"
    }
    'backend' {
        Write-Host ""
        Write-Host "=== Starting Backend Only ===" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
        Write-Host ""
        Invoke-WSLScript "dev-backend.sh"
    }
    'frontend' {
        Write-Host ""
        Write-Host "=== Starting Frontend Only ===" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
        Write-Host ""
        Invoke-WSLScript "dev-frontend.sh"
    }
    'help' {
        Show-Help
    }
    default {
        Show-Help
    }
}
