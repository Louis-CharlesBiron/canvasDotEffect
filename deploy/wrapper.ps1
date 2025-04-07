<#
    THIS IS THE SOURCE CODE OF WRAPPER.EXE
#>
function getAt() {$inv=$global:MyInvocation.MyCommand;if($inv.CommandType -eq "ExternalScript"){$ScriptPath=Split-Path -Parent -Path $inv.Definition}else{$ScriptPath=Split-Path -Parent -Path ([Environment]::GetCommandLineArgs()[0]);if(!$ScriptPath){$ScriptPath="."}};return $ScriptPath}

#GET LOCATIONS
$at = getAt
$root = Split-Path -Path $at -Parent
$dist = "$root\dist"
$readme = "$root\readme.md"
$deploy = "$root\deploy"
$terser = "$deploy\node_modules\.bin\terser"

#UPDATE README
(Get-Content $readme) -replace '"cdejs": "\^.*?"', @"
`"cdejs`": `"^$((Get-Content "$dist\package.json" | ConvertFrom-Json).version)`"
"@ | Set-Content $readme
$a = '"cdejs": "^1.0.5"'
$asd = "1.0.6"

Copy-Item "$root\readme.md" -Destination "$dist\readme.md" -Force

#GET CONFIG
$c = Get-Content "$at\deployConfig.json" | ConvertFrom-Json

#GET ALL SRC FILES
$fullPaths = Get-ChildItem "$root\src" -File -Recurse | ForEach-Object {$_.FullName} 

#MERGE ALL CODE IN ORDER
$mergedCode = ""
$mergedCodeESM = ""
$UMDCJSClasses = ""
$UMDJSClasses = ""
$c.wrapOrder.split(" ") | ForEach-Object {
    $orderPath = $_
    $className = $_ -replace "\.js$", ""

    $UMDCJSClasses += "$className,"
    $UMDJSClasses += "window.$className=$className;"

    $content = Get-Content ($fullPaths | Where-Object {(Split-Path $_ -Leaf) -eq $orderPath}) -Raw
    $mergedCode += "$content`n"
    $mergedCodeESM += "$($content -replace "class $className", "export class $className")`n"
}

#CREATE MERGED FILE
$toMinifyPath = New-Item "$dist\canvasDotEffect.js" -Value $mergedCode -Force
$toMinifyPathESM = New-Item "$dist\cde.js" -Value $mergedCodeESM -Force

#CREATE MINIFIED MERGED FILE
if (-not (Test-Path $terser)) {
    Set-Location $deploy
    npm ci
    Set-Location $at
}

$minifiedCodePathUMD = "$dist\canvasDotEffect.min.js"
Start-Process -FilePath $terser -ArgumentList "$toMinifyPathESM -o $dist\cde.min.js --compress"
Start-Process -FilePath $terser -ArgumentList "$toMinifyPath -o $minifiedCodePathUMD --compress" -wait

#ADD UMD WRAPPER
$minifiedCode = Get-Content -Path $minifiedCodePathUMD -Raw
Set-Content -Path $minifiedCodePathUMD -Value @"
(function(factory){typeof define=="function"&&define.amd?define(factory):factory()})((function(){"use strict";$minifiedCode;const classes={$UMDCJSClasses};if(typeof window!=="undefined"){window.CDE=classes}else if(typeof module!=="undefined"&&module.exports)module.exports=classes}))
"@