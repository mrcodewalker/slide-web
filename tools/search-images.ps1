param([string[]]$Queries, [int]$Limit = 8, [string]$Out = "")
# Tìm ảnh trên Wikimedia Commons (ảnh thật từ internet, không generate)
$ua = @{ "User-Agent" = "slide-web-nodejs-course/1.0 (education; local use)" }
$lines = @()
foreach ($q in $Queries) {
  $lines += "=== $q"
  $url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=$Limit&gsrsearch=$([uri]::EscapeDataString($q))&prop=imageinfo&iiprop=url|size|mime&format=json"
  for ($try = 0; $try -lt 4; $try++) {
    try {
      $r = Invoke-RestMethod -Uri $url -Headers $ua
      foreach ($p in $r.query.pages.PSObject.Properties) {
        $i = $p.Value.imageinfo[0]
        if ($i.mime -like "image/*" -and $i.mime -ne "image/tiff") {
          $lines += ("{0} | {1}x{2} | {3}" -f $p.Value.title.Substring(5), $i.width, $i.height, $i.url)
        }
      }
      break
    } catch { Start-Sleep -Seconds 6 }
  }
  Start-Sleep -Seconds 2
}
if ($Out) { $lines | Set-Content -Encoding UTF8 $Out } else { $lines }
