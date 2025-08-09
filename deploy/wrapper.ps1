<#
    THIS IS THE SOURCE CODE OF WRAPPER.EXE
#>

#GET LOCATIONS
$at = Get-Location
$root = Split-Path -Path $at -Parent
$dist = "$root\dist"
$bins = "$root\dist\bins"
$verisonedFiles = @("$root\readme.md", "$bins\createProjectTemplate.js")
$deploy = "$root\deploy"
$terser = "$deploy\node_modules\.bin\terser"
$version = (Get-Content "$dist\package.json" | ConvertFrom-Json).version

#UPDATE VERSIONED FILES
foreach ($filepath in $verisonedFiles) {
(Get-Content $filepath) -replace '"cdejs": "\^.*?"', @"
`"cdejs`": `"^$version`"
"@ | Set-Content $filepath
}

# UPDATE DIST README
Copy-Item "$root\readme.md" -Destination "$dist\readme.md" -Force

#GET CONFIG
$c = Get-Content "$at\deployConfig.json" | ConvertFrom-Json

#GET ALL SRC FILES
$fullPaths = Get-ChildItem "$root\src" -File -Recurse | ForEach-Object {$_.FullName} 

#MERGE ALL CODE IN ORDER
$mergedCode = ""
$mergedCodeESM = ""
$UMDCJSClasses = ""
$c.wrapOrder.split(" ") | ForEach-Object {
    $orderPath = $_
    $className = $_ -replace "\.js$", ""

    $UMDCJSClasses += "$className,"

    $content = Get-Content ($fullPaths | Where-Object {(Split-Path $_ -Leaf) -eq $orderPath}) -Raw
    $mergedCode += "$content`n"
    $mergedCodeESM += "$($content -replace "class $className", "export class $className")`n"
}
$mergedCode = "'use strict';`n$($mergedCode.Trim())"
$mergedCodeESM = $mergedCodeESM.Trim()

#CREATE MERGED FILE
$toMinifyPath = New-Item "$dist\canvasDotEffect.js" -Value "// CanvasDotEffect UMD - v$version`n$mergedCode" -Force
$toMinifyPathESM = New-Item "$dist\cde.js" -Value "// CanvasDotEffect ESM - v$version`n$mergedCodeESM" -Force

#CREATE .D.TS FILES
npx tsc

#CREATE MINIFIED MERGED FILE
if (-not (Test-Path $terser)) {
    Set-Location $deploy
    npm ci
    Set-Location $at
}

#MINIFY LIBRARY FILES
$minifiedCodePathUMD = "$dist\canvasDotEffect.min.js"
$minifiedCodePathESM = "$dist\cde.min.js"
Start-Process -FilePath $terser -ArgumentList "$toMinifyPathESM -o $minifiedCodePathESM --compress"
Start-Process -FilePath $terser -ArgumentList "$toMinifyPath -o $minifiedCodePathUMD --compress" -wait

#ADD UMD WRAPPER
$minifiedCode = Get-Content -Path $minifiedCodePathUMD -Raw
Set-Content -Path $minifiedCodePathUMD -Value @"
// CanvasDotEffect UMD - v$version
(function(factory){if(typeof define==="function"&&define.amd)define([],factory);else if(typeof module==="object"&&module.exports)module.exports=factory();else if(typeof window!=="undefined")window.CDE=factory();else this.CDE=factory()})(function(){$minifiedCode;return{$UMDCJSClasses}})
"@

#ADD VERSION COMMENT TO ESM
Set-Content -Path $minifiedCodePathESM -Value "// CanvasDotEffect ESM - v$version`n$(Get-Content $minifiedCodePathESM -Raw)"

#MINIFY BINS FILES
$binFiles = @("createBrowserProjectTemplate.js", "createDefaultReactComponent.js", "createProjectTemplate.js", "getSignature.js", "openDocumentation.js", "global.js")
foreach ($filepath in $binFiles) {
    $filepath = "$bins\$filepath"
    Start-Process -FilePath $terser -ArgumentList "$filepath -o $bins\$((Get-Item $filepath).BaseName).min.js --compress --mangle"
}