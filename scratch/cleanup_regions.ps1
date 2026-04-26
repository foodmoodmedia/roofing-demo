$files = Get-ChildItem -Path . -Filter *.html -Recurse

$replacements = @{
    "Serving FL" = "Serving Glasgow"
    "Broward" = "Glasgow"
    "Palm Beach" = "Scotland"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    $content | Set-Content $file.FullName
}
