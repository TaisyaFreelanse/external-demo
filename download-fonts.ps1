# PowerShell script to download DejaVu Sans fonts for jsPDF
# Run this script from the project root directory

Write-Host "Downloading DejaVu Sans fonts..." -ForegroundColor Green

# Create fonts directory if it doesn't exist
$fontsDir = "public\fonts"
if (-not (Test-Path $fontsDir)) {
    New-Item -ItemType Directory -Path $fontsDir -Force | Out-Null
}

# Download fonts using direct links from a reliable CDN
$fonts = @{
    "DejaVuSans.ttf" = "https://github.com/dejavu-fonts/dejavu-fonts/raw/master/ttf/DejaVuSans.ttf"
    "DejaVuSans-Oblique.ttf" = "https://github.com/dejavu-fonts/dejavu-fonts/raw/master/ttf/DejaVuSans-Oblique.ttf"
}

foreach ($font in $fonts.GetEnumerator()) {
    $fontPath = Join-Path $fontsDir $font.Key
    Write-Host "Downloading $($font.Key)..." -ForegroundColor Yellow
    
    try {
        # Use Invoke-WebRequest with proper error handling
        $response = Invoke-WebRequest -Uri $font.Value -OutFile $fontPath -ErrorAction Stop
        
        if (Test-Path $fontPath) {
            $fileSize = (Get-Item $fontPath).Length
            if ($fileSize -gt 10000) {  # Font files should be larger than 10KB
                $sizeKB = [math]::Round($fileSize / 1024, 2)
                Write-Host "Successfully downloaded $($font.Key) ($sizeKB KB)" -ForegroundColor Green
            } else {
                Write-Host "Downloaded file is too small, may be an error page" -ForegroundColor Red
                Remove-Item $fontPath -Force
            }
        }
    } catch {
        Write-Host "Failed to download $($font.Key): $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  Please download manually from: https://github.com/dejavu-fonts/dejavu-fonts/releases" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Font download complete!" -ForegroundColor Green

