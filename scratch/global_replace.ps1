$files = Get-ChildItem -Path . -Filter *.html -Recurse

$replacements = @{
    "K&R General Services" = "Glasgow Roofing"
    "K&R" = "Glasgow"
    "(954) 297-4439" = "0141 482 7035"
    "9542974439" = "01414827035"
    "kandrgeneralservices@gmail.com" = "info@glasgowroofing.co.uk"
    "South Florida" = "Glasgow"
    "Broward & Palm Beach County" = "Glasgow & surrounding areas"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    $content | Set-Content $file.FullName
}
