# 🚀 Quick Start Script - Update Backend CORS

# This script helps you update the backend .env file with the tunnel URLs

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   JanaSeva - Backend CORS Configuration" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Tunnel URLs
$frontendTunnel = "https://honest-coats-enter.loca.lt"
$backendTunnel = "https://social-ghosts-marry.loca.lt"

Write-Host "Frontend Tunnel: $frontendTunnel" -ForegroundColor Green
Write-Host "Backend Tunnel:  $backendTunnel" -ForegroundColor Green
Write-Host ""

# Path to .env file
$envFile = "C:\Users\Gogul\JanaSeva\backend\.env"

Write-Host "Updating $envFile..." -ForegroundColor Yellow
Write-Host ""

# Check if file exists
if (Test-Path $envFile) {
    # Read current content
    $content = Get-Content $envFile -Raw
    
    # Update or add CORS_ORIGIN
    if ($content -match "CORS_ORIGIN=") {
        # Update existing CORS_ORIGIN
        $content = $content -replace "CORS_ORIGIN=.*", "CORS_ORIGIN=http://localhost:5173,$frontendTunnel"
        Write-Host "✅ Updated existing CORS_ORIGIN" -ForegroundColor Green
    } elseif ($content -match "FRONTEND_URL=") {
        # Update existing FRONTEND_URL
        $content = $content -replace "FRONTEND_URL=.*", "FRONTEND_URL=http://localhost:5173,$frontendTunnel"
        Write-Host "✅ Updated existing FRONTEND_URL" -ForegroundColor Green
    } else {
        # Add new CORS_ORIGIN
        $content += "`nCORS_ORIGIN=http://localhost:5173,$frontendTunnel`n"
        Write-Host "✅ Added new CORS_ORIGIN" -ForegroundColor Green
    }
    
    # Write back to file
    $content | Set-Content $envFile -NoNewline
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "   Configuration Updated Successfully!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Restart your backend server!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor White
    Write-Host "1. Go to the terminal running backend" -ForegroundColor White
    Write-Host "2. Press Ctrl+C to stop it" -ForegroundColor White
    Write-Host "3. Run: npm run dev" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "❌ Error: .env file not found at $envFile" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create the file manually with:" -ForegroundColor Yellow
    Write-Host "CORS_ORIGIN=http://localhost:5173,$frontendTunnel" -ForegroundColor White
}

Write-Host ""
Write-Host "📱 Your Public URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: $frontendTunnel" -ForegroundColor Green
Write-Host "   Backend:  $backendTunnel" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Open the frontend URL on your mobile to test!" -ForegroundColor Green
Write-Host ""
