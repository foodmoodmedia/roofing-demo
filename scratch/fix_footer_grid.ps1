$files = Get-ChildItem -Path . -Filter *.html -Recurse

$replacements = @{
    'style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px"' = 'class="footer-grid"'
    'style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px"' = 'class="grid-3"'
    'style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px"' = 'class="grid-3"'
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    foreach ($key in $replacements.Keys) {
        $content = $content.Replace($key, $replacements[$key])
    }
    if ($content -ne $original) {
        $content | Set-Content $file.FullName
    }
}
