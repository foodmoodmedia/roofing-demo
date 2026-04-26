$files = Get-ChildItem -Path . -Include *.html,*.css -Recurse

$replacements = @{
    "#FF4500" = "#7CFC00"
    "#E8B4A1" = "#00FF7F"
    "#e8521e" = "#32CD32"
    "0xFF4500" = "0x7CFC00"
    "rgba(255,69,0" = "rgba(124,252,0"
    "rgb(255,69,0" = "rgb(124,252,0"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    $content | Set-Content $file.FullName
}
