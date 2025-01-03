<#
    THIS IS THE SOURCE CODE OF WRAPPER.EXE
#>
function getAt() {$inv=$global:MyInvocation.MyCommand;if($inv.CommandType -eq "ExternalScript"){$ScriptPath=Split-Path -Parent -Path $inv.Definition}else{$ScriptPath=Split-Path -Parent -Path ([Environment]::GetCommandLineArgs()[0]);if(!$ScriptPath){$ScriptPath="."}};return $ScriptPath}

#GET LOCATIONS
$at = getAt
$root = Split-Path -Path $at -Parent
$dist = "$root\dist"
$deploy = "$root\deploy"
$terser = "$deploy\node_modules\.bin\terser"

#GET CONFIG
$c = Get-Content "$at\deployConfig.json" | ConvertFrom-Json

#GET ALL SRC FILES
$fullPaths = Get-ChildItem "$root\src" -File -Recurse | ForEach-Object {$_.FullName} 

#MERGE ALL CODE IN ORDER
$mergedCode = ""
$c.wrapOrder.split(" ") | ForEach-Object {
    $orderPath = $_
    $mergedCode += "$(Get-Content ($fullPaths | Where-Object {(Split-Path $_ -Leaf) -eq $orderPath}) -Raw)`n"
}

#CREATE MERGED FILE
$toMinifyPath = New-Item "$dist\canvasDotEffect.js" -Value $mergedCode -Force

#CREATE MINIFIED MERGED FILE
if (-not (Test-Path $terser)) {
    Set-Location $deploy
    npm install
    Set-Location $at
}
& $terser $toMinifyPath -o "$dist\canvasDotEffect.min.js" --compress