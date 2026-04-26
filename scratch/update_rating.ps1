$files = Get-ChildItem -Path . -Filter *.html -Recurse

$replacements = @{
    "700+ 5-Star Reviews" = "152 5-Star Reviews"
    "700+ Reviews" = "152 Reviews"
    "700+ Verified Reviews" = "152 Verified Reviews"
    "4.8/5" = "4.9/5"
    "4.8 rating" = "4.9 rating"
    'data-count="700"' = 'data-count="152"'
    'data-suffix="+"' = 'data-suffix="+"' # Keep suffix
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    # Special case for "700+" in stat-num if it's not handled by data-count
    $content = $content -replace '>700\+<', '>152+<'
    
    $content | Set-Content $file.FullName
}
