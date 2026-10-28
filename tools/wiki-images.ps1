param([string[]]$Titles, [string]$Out = "")
# Liệt kê ảnh dùng trong các bài Wikipedia (sơ đồ/kiến trúc thật từ internet)
$ua = @{ "User-Agent" = "slide-web-nodejs-course/1.0 (education; local use)" }
$skip = 'Commons-logo|Question_book|Ambox|Edit-clear|Wiki|Padlock|Increase|Decrease|Folder|Symbol|Portal|OOjs|Flag_of|Crystal|Nuvola|Lock-|Searchtool|Semi-protection|Cscr|Gnome|Blue_pencil|Text_document|Stub|Mergefrom|Merge-|Information_icon|Speaker_Icon|Magnify|Red_pog|Disambig|Nav|Unbalanced|Cleanup|Commons-emblem|Redirect|Arrow|Static_Wikipedia|Loudspeaker|Free_Software|Emoji|Replacement|P_vip|Fairytale|Cc-|Creative_Commons|Template|Wikidata|Wikibooks|Wiktionary|Wikiquote|Wikisource|Wikinews'
$lines = @()
foreach ($t in $Titles) {
  $lines += "=== $t"
  $url = "https://en.wikipedia.org/w/api.php?action=query&generator=images&titles=$([uri]::EscapeDataString($t))&gimlimit=60&prop=imageinfo&iiprop=url|size|mime&format=json"
  for ($try = 0; $try -lt 4; $try++) {
    try {
      $r = Invoke-RestMethod -Uri $url -Headers $ua
      foreach ($p in $r.query.pages.PSObject.Properties) {
        $i = $p.Value.imageinfo[0]
        if (-not $i) { continue }
        $name = $p.Value.title.Substring(5)
        if ($name -match $skip) { continue }
        if ($i.mime -notlike "image/*" -or $i.width -lt 220) { continue }
        $lines += ("{0} | {1}x{2} | {3}" -f $name, $i.width, $i.height, ($i.url -replace 'https://upload.wikimedia.org/wikipedia/',''))
      }
      break
    } catch { Start-Sleep -Seconds 5 }
  }
  Start-Sleep -Milliseconds 1500
}
if ($Out) { $lines | Set-Content -Encoding UTF8 $Out } else { $lines }
