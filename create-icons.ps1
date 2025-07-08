Add-Type -AssemblyName System.Drawing

function Create-Icon($size, $filename) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Purple background
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(139, 92, 246))
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    
    # White document shape
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $padding = [math]::Max(2, $size * 0.2)
    $docWidth = $size - $padding * 2
    $docHeight = $size - $padding * 2
    $graphics.FillRectangle($whiteBrush, $padding, $padding, $docWidth, $docHeight)
    
    # Save icon
    $bitmap.Save("icons\$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $whiteBrush.Dispose()
    
    Write-Host "Created icons\$filename ($size x $size)"
}

# Create icons directory
New-Item -ItemType Directory -Force -Path "icons"

# Create all icon sizes
Create-Icon 16 "icon16.png"
Create-Icon 32 "icon32.png"
Create-Icon 48 "icon48.png"
Create-Icon 128 "icon128.png"

Write-Host "All icons created successfully!"
