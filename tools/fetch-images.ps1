# ------------------------------------------------------------
# Tải ảnh THẬT từ internet (Wikimedia Commons, MDN, libuv, ...) về assets/img
# và sinh js/img-credits.js (ghi nguồn + giấy phép).
# Chạy:  .\tools\fetch-images.ps1
# ------------------------------------------------------------
$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $root "assets\img"
New-Item -ItemType Directory -Force $dest | Out-Null
$ua = @{ "User-Agent" = "slide-web-nodejs-course/1.0 (education; local use)" }

# --- Wikimedia Commons: local name => file title ---
$commons = [ordered]@{
  "node-logo.svg"          = "Node.js_logo.svg"
  "node-mascot.svg"        = "Node.JS_Mascot.svg"
  "express-logo.png"       = "Expressjs.png"
  "mysql-logo.svg"         = "MySQL_textlogo.svg"
  "jwt-logo.svg"           = "JWT-Logo.svg"
  "npm-logo.svg"           = "Npm-logo.svg"
  "git-logo.svg"           = "Git-logo.svg"
  "docker-logo.svg"        = "Docker_(container_engine)_logo.svg"
  "js-logo.svg"            = "Unofficial_JavaScript_logo_2.svg"
  "postman-logo.png"       = "Postman_(software).png"
  "nginx-logo.svg"         = "Nginx-logo.svg"
  "html5-logo.svg"         = "HTML5_logo_and_wordmark.svg"
  "css3-logo.svg"          = "CSS3_logo.svg"
  "v8-logo.svg"            = "V8_JavaScript_engine_logo_2.svg"
  "openapi-logo.svg"       = "OpenAPI_Logo_Pantone.svg"
  "swagger-logo.svg"       = "Swagger_SmartBear_logo.svg"
  "vscode-logo.svg"        = "Visual_Studio_Code_1.35_icon.svg"
  "three-tier.svg"         = "Overview_of_a_three-tier_application_vectorVersion.svg"
  "client-server.svg"      = "Client-server-model.svg"
  "mvc-process.svg"        = "MVC-Process.svg"
  "mvc-pattern.svg"        = "Model-View-Controller_architectural_pattern.svg"
  "http-logo.svg"          = "HTTP_logo.svg"
  "ryan-dahl.jpg"          = "Ryan_Dahl.jpg"
  "tim-berners-lee.jpg"    = "Tim_Berners-Lee_CP_2.jpg"
  "first-web-server.jpg"   = "First_Web_Server.jpg"
  "reactor-sequence.svg"   = "ReactorPattern_-_UML_2_Sequence_Diagram.svg"
  "reactor-component.svg"  = "Reactor_Pattern_-_UML_2_Component_Diagram.svg"
  "callback-async.svg"     = "Callback-async-notitle.svg"
  "callback-sync.svg"      = "Callback-notitle.svg"
  "er-mmorpg.svg"          = "ER_Diagram_MMORPG.svg"
  "erd-representation.svg" = "ERD_Representation.svg"
  "join-inner.svg"         = "SQL_Join_-_07_A_Inner_Join_B.svg"
  "join-left.svg"          = "SQL_Join_-_01_A_Left_Join_B.svg"
  "join-right.svg"         = "SQL_Join_-_03_A_Right_Join_B.svg"
  "join-full.svg"          = "SQL_Join_-_05_A_Full_Join_B.svg"
  "relational-terms.svg"   = "Relational_database_terms.svg"
  "mysql-workbench.jpg"    = "MySQL_Workbench_editor_screenshot.jpg"
  "mysql-founders.jpg"     = "Monty-Widenius-David-Axmark-MySQL-2003-05-09.jpg"
  "cookie-exchange.svg"    = "HTTP_cookie_exchange.svg"
  "hash-function.svg"      = "Cryptographic_Hash_Function.svg"
  "rbac.svg"               = "Role-based_access_control.svg"
  "oauth-flow.svg"         = "Abstract-flow.svg"
  "cors-flowchart.svg"     = "Flowchart_showing_Simple_and_Preflight_XHR.svg"
  "cia-triad.svg"          = "CIAJMK1209-en.svg"
  "owasp-logo.svg"         = "OWASP_black_logo.svg"
  "owasp-2021.png"         = "OWASP_Comparison_2017_vs._2021.png"
  "static-dynamic.png"     = "Web_server_serving_static_and_dynamic_content.png"
  "dns.jpg"                = "Domain-name-system.jpg"
  "http-telnet.png"        = "Http_request_telnet_ubuntu.png"
  "tcpip.svg"              = "Basic_TCP-IP_node-en.svg"
  "docker-interfaces.svg"  = "Docker-linux-interfaces.svg"
  "cloud-types.svg"        = "Cloud_computing_types.svg"
  "douglas-crockford.jpg"  = "Douglas_Crockford.jpg"
}

# --- Nguồn khác: local name => url / source / license / page ---
$mdnShared = "https://mdn.github.io/shared-assets/images/diagrams/http"
$mdnRaw = "https://raw.githubusercontent.com/mdn/content/main/files/en-us"
function M($name, $url, $page) { @{ n = $name; u = $url; source = "MDN Web Docs"; license = "CC BY-SA 2.5"; author = "Mozilla contributors"; page = $page; title = $name } }
$others = @(
  (M "mdn-http-request.svg"    "$mdnShared/overview/http-request.svg"  "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
  (M "mdn-http-response.svg"   "$mdnShared/overview/http-response.svg" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
  (M "mdn-http-layers.svg"     "$mdnShared/overview/http-layers.svg"   "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
  (M "mdn-fetching-page.svg"   "$mdnShared/overview/fetching-a-page.svg" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
  (M "mdn-client-server-chain.svg" "$mdnShared/overview/client-server-chain.svg" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
  (M "mdn-http-message.svg"    "$mdnShared/messages/http-message-anatomy.svg" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"),
  (M "mdn-cors-overview.svg"   "$mdnShared/cors/fetching-page-cors.svg" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"),
  (M "mdn-cors-simple.svg"     "$mdnShared/cors/simple-request.svg"    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"),
  (M "mdn-cors-preflight.svg"  "$mdnShared/cors/preflight-correct.svg" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"),
  (M "mdn-cookie-example.png"  "$mdnShared/cookies/cookie-basic-example.png" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies"),
  (M "mdn-basic-auth.svg"      "$mdnShared/authentication/basic-auth.svg" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication"),
  (M "mdn-cache-types.svg"     "$mdnShared/cache/type-of-cache.svg"    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching"),
  (M "mdn-redirect.svg"        "$mdnRaw/web/http/guides/redirections/httpredirect.svg" "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections"),
  (M "mdn-static-server.png"   "$mdnRaw/learn_web_development/extensions/server-side/first_steps/client-server_overview/basic_static_app_server.png" "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview"),
  (M "mdn-dynamic-server.png"  "$mdnRaw/learn_web_development/extensions/server-side/first_steps/client-server_overview/web_application_with_html_and_steps.png" "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview"),
  (M "mdn-express-mvc.png"     "$mdnRaw/learn_web_development/extensions/server-side/express_nodejs/routes/mvc_express.png" "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes"),
  (M "mdn-js-runtime.svg"      "$mdnRaw/web/javascript/reference/execution_model/runtime-environment-diagram.svg" "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model"),
  @{ n = "libuv-loop.png"; u = "https://raw.githubusercontent.com/libuv/libuv/v1.x/docs/src/static/loop_iteration.png"; source = "libuv docs"; license = "MIT"; author = "libuv contributors"; page = "https://docs.libuv.org/en/v1.x/design.html"; title = "libuv - The I/O loop" },
  @{ n = "libuv-architecture.png"; u = "https://raw.githubusercontent.com/libuv/libuv/v1.x/docs/src/static/architecture.png"; source = "libuv docs"; license = "MIT"; author = "libuv contributors"; page = "https://docs.libuv.org/en/v1.x/design.html"; title = "libuv - Architecture" },
  @{ n = "sequelize-logo.svg"; u = "https://raw.githubusercontent.com/sequelize/sequelize/main/logo.svg"; source = "Sequelize (GitHub)"; license = "MIT"; author = "Sequelize"; page = "https://github.com/sequelize/sequelize"; title = "Sequelize logo" },
  @{ n = "jest-logo.svg"; u = "https://jestjs.io/img/jest.svg"; source = "jestjs.io"; license = "MIT"; author = "Jest / OpenJS"; page = "https://jestjs.io"; title = "Jest logo" },
  @{ n = "postman-icon.svg"; u = "https://voyager.postman.com/logo/postman-logo-icon-orange.svg"; source = "Postman"; license = "Logo © Postman"; author = "Postman Inc."; page = "https://www.postman.com/"; title = "Postman logo" }
)

function Strip($s) { if (-not $s) { return "" }; ([regex]::Replace($s, '<[^>]+>', '')).Trim() -replace '\s+', ' ' }
function Get-File($url, $out) {
  for ($k = 0; $k -lt 4; $k++) {
    try { Invoke-WebRequest $url -OutFile $out -Headers $ua -UseBasicParsing; if ((Get-Item $out).Length -gt 200) { return $true } } catch { Start-Sleep -Seconds (8 + 8 * $k) }
  }
  return $false
}

$credits = [ordered]@{}
$failed = @()

# ----- Commons (theo lô 20 file) -----
$keys = @($commons.Keys)
for ($i = 0; $i -lt $keys.Count; $i += 20) {
  $batch = $keys[$i..([Math]::Min($i + 19, $keys.Count - 1))]
  $titles = ($batch | ForEach-Object { "File:" + $commons[$_] }) -join "|"
  $api = "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1400&titles=$([uri]::EscapeDataString($titles))"
  $r = $null
  for ($k = 0; $k -lt 5 -and -not $r; $k++) { try { $r = Invoke-RestMethod $api -Headers $ua } catch { Start-Sleep -Seconds 6 } }
  if (-not $r) { $failed += $batch; continue }
  $map = @{}
  foreach ($p in $r.query.pages.PSObject.Properties) { $map[$p.Value.title] = $p.Value }
  foreach ($loc in $batch) {
    $t = "File:" + $commons[$loc].Replace("_", " ")
    $pg = $map[$t]
    if (-not $pg -or -not $pg.imageinfo) { Write-Output "MISSING $t"; $failed += $loc; continue }
    $ii = $pg.imageinfo[0]
    $isSvg = $ii.mime -eq "image/svg+xml"
    $url = if (-not $isSvg -and $ii.width -gt 1400 -and $ii.thumburl) { $ii.thumburl } else { $ii.url }
    $out = Join-Path $dest $loc
    if (Test-Path $out) { $ok = $true } else { $ok = Get-File $url $out; Start-Sleep -Milliseconds 3000 }
    if ($ok) {
      $em = $ii.extmetadata
      $credits[$loc] = @{ title = $t.Substring(5); page = $ii.descriptionurl; author = (Strip $em.Artist.value); license = (Strip $em.LicenseShortName.value); source = "Wikimedia Commons" }
      Write-Output "OK  $loc"
    } else { Write-Output "FAIL $loc"; $failed += $loc }
  }
}

# ----- Nguồn khác -----
foreach ($o in $others) {
  $out = Join-Path $dest $o.n
  if (Test-Path $out) { $ok = $true } else { $ok = Get-File $o.u $out; Start-Sleep -Milliseconds 500 }
  if ($ok) { $credits[$o.n] = @{ title = $o.title; page = $o.page; author = $o.author; license = $o.license; source = $o.source }; Write-Output "OK  $($o.n)" }
  else { Write-Output "FAIL $($o.n)"; $failed += $o.n }
}

# ----- Sinh js/img-credits.js -----
$json = $credits | ConvertTo-Json -Depth 4
$js = "/* Tự sinh bởi tools/fetch-images.ps1 - nguồn & giấy phép ảnh */`nwindow.IMG_CREDITS = $json;`n"
[System.IO.File]::WriteAllText((Join-Path $root "js\img-credits.js"), $js, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "`nDONE. OK=$($credits.Count)  FAILED=$($failed.Count) : $($failed -join ', ')"
