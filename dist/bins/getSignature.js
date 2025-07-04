#!/usr/bin/env node
const signatures = [
    ["_BaseObj"     , `constructor(pos, color, setupCB, loopCB, anchorPos, activationMargin)`, `constructor(pos=[0,0], color="aliceblue", setupCB=null, loopCB=null, anchorPos=null, activationMargin=null)`],
    ["_DynamicColor", `constructor(positions, rotation)`, `constructor(positions, rotation=0)`],
    ["_HasColor"    , `constructor(color)`, `constructor(color="aliceblue")`],
    ["_Obj"         , `constructor(pos, radius, color, setupCB, loopCB, anchorPos, activationMargin)`, `constructor(pos=[0,0], radius=5, color="aliceblue", setupCB=null, loopCB=null, anchorPos=null, activationMargin=null)`],
    ["Anim"         , `new Anim(animation, duration, easing, endCB)`, `new Anim(animation, duration=1000, easing=Anim.linear, endCB)`],
    ["Canvas"       , `new Canvas(cvs, loopingCB, fpsLimit, visibilityChangeCB, cvsFrame, settings, willReadFrequently)`, `new Canvas(cvs, loopingCB, fpsLimit=null, visibilityChangeCB, cvsFrame=cvs.parentElement, settings=Canvas.DEFAULT_CTX_SETTINGS, willReadFrequently=false)`],
    ["Color"        , `new Color(color, isChannel)`, `new Color(color, isChannel=false)`],
    ["Gradient"     , `new Gradient(ctx, positions, colorStops, type, rotation)`, `new Gradient(ctx, positions, colorStops, type="Linear", rotation=0)`],
    ["Mouse"        , `constructor()`, `constructor()`],
    ["Pattern"      , `new Pattern(render, source, positions, sourceCroppingPositions, keepAspectRatio, forcedUpdates, rotation, errorCB, readyCB, frameRate, repeatMode)`, `new Pattern(render, source, positions, sourceCroppingPositions=null, keepAspectRatio=false, forcedUpdates=null, rotation=0, errorCB, readyCB, frameRate=30, repeatMode="no-repeat")`],
    ["Render"       , `constructor(ctx)`, `constructor(ctx)`],
    ["RenderStyles" , `new RenderStyles(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap)`, `new RenderStyles(render, color, filter="none", compositeOperation="source-over", opacity=1, lineWidth=2, lineDash=[], lineDashOffset=0, lineJoin="miter", lineCap="round")`],
    ["TextStyles"   , `new TextStyles(render, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)`, `new TextStyles(render, font="32px Arial", letterSpacing="2px", wordSpacing="4px", fontVariantCaps="normal", direction="ltr", fontStretch="normal", fontKerning="normal", textAlign="center", textBaseline="middle", textRendering="optimizeSpeed")`],
    ["TypingDevice" , `constructor()`, `constructor()`],
    ["AudioDisplay" , `new AudioDisplay(source, pos, color, binCB, sampleCount, disableAudio, offsetPourcent, errorCB, setupCB, loopCB, anchorPos, activationMargin)`, `new AudioDisplay(source, pos=[0,0], color="aliceblue", binCB=AudioDisplay.DEFAULT_BINCB, sampleCount=64, disableAudio=false, offsetPourcent=0, errorCB, setupCB=null, loopCB=null, anchorPos=null, activationMargin=null)`],
    ["Dot"          , `new Dot(pos, radius, color, setupCB, anchorPos, activationMargin, disablePathCaching)`, `new Dot(pos=[0,0], radius=5, color="aliceblue", setupCB=null, anchorPos=null, activationMargin=null, disablePathCaching=false)`],
    ["FilledShape"  , `new FilledShape(fillColor, dynamicUpdates, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)`, `new FilledShape(fillColor, dynamicUpdates=false, pos=[0,0], dots=[], radius=5, color="aliceblue", limit=100, drawEffectCB, ratioPosCB, setupCB=null, loopCB=null, anchorPos=null, activationMargin=null, fragile=false)`],
    ["Grid"         , `new Grid(keys, gaps, spacing, source, pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)`, `new Grid(keys="", gaps=[10,10], spacing=Grid.DEFAULT_SPACING(this), source=GridAssets.DEFAULT_SOURCE, pos=[0,0], radius=5, color="aliceblue", limit=100, drawEffectCB, ratioPosCB, setupCB=null, loopCB=null, anchorPos=null, activationMargin=null, fragile=false)`],
    ["ImageDisplay" , `new ImageDisplay(source, pos, size, errorCB, setupCB, loopCB, anchorPos, activationMargin)`, `new ImageDisplay(source, pos=[0,0], size, errorCB, setupCB=null, loopCB=null, anchorPos=null, activationMargin=null)`],
    ["Shape"        , `new Shape(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, activationMargin, fragile)`, `new Shape(pos=[0,0], dots=[], radius=5, color="aliceblue", limit=100, drawEffectCB, ratioPosCB, setupCB=null, loopCB=null, anchorPos=null, activationMargin=null, fragile=false)`],
    ["TextDisplay"  , `new TextDisplay(text, pos, color, textStyles, drawMethod, maxWidth, setupCB, loopCB, anchorPos, activationMargin)`, `new TextDisplay(text="", pos=[0,0], color="aliceblue", textStyles, drawMethod="FILL", maxWidth=undefined, setupCB=null, loopCB=null, anchorPos=null, activationMargin=null)`],
    ["FPSCounter"   , `new FPSCounter(avgSampleSize)`, `new FPSCounter(avgSampleSize=10)`],
    ["drawEffectCB" , `(render, dot, ratio, parentSetupResults, mouse, distance, parent, isActive)=>{}`, `(render, dot, ratio, parentSetupResults, mouse, distance, parent, isActive)=>{}`],
    ["setupCB"      , `(obj, parent)=>{}`, `(obj, parent)=>{}`],
    ["loopCB"       , `(obj)=>{}`, `(obj)=>{}`],
    ["initPos"      , `(cvs, obj)=>{return [x,y]}`, `(cvs, obj)=>{return [x,y]}`],
    ["initRadius"   , `(parentOrObj)=>{return radiusValue}`, `(parentOrObj)=>{return radiusValue}`],
    ["initColor"    , `(render, obj)=>{return colorValue}`, `(render, obj)=>{return colorValue}`],
    ["anchorPos"    , `(obj, cvsOrParent)=>{return [x,y]}`, `(obj, cvsOrParent)=>{return [x,y]}`],
], s_ll = signatures.length, a_ll = process.argv.length

function logSignature(reqSig, withValues) {
    if (reqSig == "*") reqSig = ""
    signatures.filter(s=>s[0].toLowerCase().includes(reqSig)).forEach(([name, signature, defaultValuesSignature])=>console.log(`\n${(name+":").padEnd(15)}${withValues?defaultValuesSignature:signature}\n`))
}

const requestedSignature = process.argv[2]?.toLowerCase()||"", withValuesArg = process.argv[3]?.toLowerCase()?.trim() 
logSignature(requestedSignature, withValuesArg!=0&&withValuesArg!="false"&&Boolean(withValuesArg))