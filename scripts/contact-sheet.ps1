# Build a labelled contact sheet from a set of images so they can be reviewed
# visually in one pass. Index numbers are drawn large enough to survive the
# downscaling that happens when the sheet is read back.
#
# Usage:
#   pwsh scripts/contact-sheet.ps1 -Pattern "public/images/*.jpg" -Columns 10 `
#        -TileWidth 300 -TileHeight 190 -Out .photo-staging/sheet.png

param(
  [Parameter(Mandatory = $true)][string]$Pattern,
  [int]$Columns = 10,
  [int]$TileWidth = 300,
  [int]$TileHeight = 190,
  [int]$LabelHeight = 30,
  [Parameter(Mandatory = $true)][string]$Out
)

Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path $Pattern | Sort-Object Name
if ($files.Count -eq 0) { Write-Error "No files matched $Pattern"; exit 1 }

$rows = [math]::Ceiling($files.Count / $Columns)
$sheetWidth = $Columns * $TileWidth
$sheetHeight = $rows * ($TileHeight + $LabelHeight)

$bitmap = New-Object System.Drawing.Bitmap($sheetWidth, $sheetHeight)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([System.Drawing.Color]::FromArgb(18, 18, 20))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

$indexFont = New-Object System.Drawing.Font("Consolas", 20, [System.Drawing.FontStyle]::Bold)
$nameFont = New-Object System.Drawing.Font("Consolas", 9)
$indexBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(244, 183, 42))
$nameBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 210, 215))
$padBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(32, 32, 36))

$i = 0
foreach ($file in $files) {
  $col = $i % $Columns
  $row = [math]::Floor($i / $Columns)
  $x = $col * $TileWidth
  $y = $row * ($TileHeight + $LabelHeight)

  # Letterbox rather than crop: the point is to see the whole photograph and
  # judge whether its subject actually matches the slot it was chosen for.
  try {
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    $scale = [math]::Min($TileWidth / $img.Width, $TileHeight / $img.Height)
    $w = [int]($img.Width * $scale)
    $h = [int]($img.Height * $scale)
    $ox = $x + [int](($TileWidth - $w) / 2)
    $oy = $y + [int](($TileHeight - $h) / 2)
    $graphics.DrawImage($img, $ox, $oy, $w, $h)
    $img.Dispose()
  } catch {
    $graphics.FillRectangle($padBrush, $x, $y, $TileWidth, $TileHeight)
  }

  # Index, drawn over a dark plate so it stays legible on bright photographs.
  $graphics.FillRectangle($padBrush, $x, $y, 46, 34)
  $graphics.DrawString("$i", $indexFont, $indexBrush, ($x + 4), ($y + 2))

  $label = $file.BaseName
  $graphics.DrawString($label, $nameFont, $nameBrush, ($x + 2), ($y + $TileHeight + 6))

  $i++
}

$outputPath = Join-Path (Get-Location) $Out
$dir = Split-Path $outputPath -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()

Write-Output "Sheet: $outputPath  ($sheetWidth x $sheetHeight, $($files.Count) tiles)"
Write-Output ""
for ($n = 0; $n -lt $files.Count; $n++) {
  Write-Output ("  {0,2}  {1}" -f $n, $files[$n].BaseName)
}
