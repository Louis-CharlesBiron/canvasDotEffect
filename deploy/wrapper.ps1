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

$minifiedCodePath = "$dist\canvasDotEffect.min.js"
Start-Process -FilePath $terser -ArgumentList "$toMinifyPath -o $minifiedCodePath --compress" -Wait

#ADD UMD WRAPPER
$minifiedCode = Get-Content -Path $minifiedCodePath -Raw
Set-Content -Path $minifiedCodePath -Value @"
(function(factory){typeof define=="function"&&define.amd?define(factory):factory()})((function(){"use strict";$minifiedCode;const classes={CDEUtils,CanvasUtils,Color,_HasColor,GridAssets,TypingDevice,Mouse,Render,TextStyles,RenderStyles,Canvas,Anim,_BaseObj,ImageDisplay,TextDisplay,_DynamicColor,Pattern,_Obj,Shape,Gradient,FilledShape,Grid,Dot};if(typeof window!=="undefined"){window.CDE=classes,window.CDEUtils=CDEUtils,window.CanvasUtils=CanvasUtils,window.Color=Color,window._HasColor=_HasColor,window.GridAssets=GridAssets,window.TypingDevice=TypingDevice,window.Mouse=Mouse,window.Render=Render,window.TextStyles=TextStyles,window.RenderStyles=RenderStyles,window.Canvas=Canvas,window.Anim=Anim,window._BaseObj=_BaseObj,window.ImageDisplay=ImageDisplay,window.TextDisplay=TextDisplay,window._DynamicColor=_DynamicColor,window.Pattern=Pattern,window._Obj=_Obj,window.Shape=Shape,window.Gradient=Gradient,window.FilledShape=FilledShape,window.Grid=Grid,window.Dot=Dot}else if(typeof module!=="undefined"&&module.exports)module.exports=classes}))
"@