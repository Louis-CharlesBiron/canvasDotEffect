#!/usr/bin/env node

// TODO, prob add default values? like with other parameters maybe
const signatures = [
    ["_BaseObj"     , `constructor(pos, color, setupCB, loopCB, anchorPos, alwaysActive)`],
    ["_DynamicColor", `constructor(positions, rotation)`],
    ["_HasColor"    , `constructor(color)`],
    ["_Obj"         , `constructor(pos, radius, color, setupCB, loopCB, anchorPos, alwaysActive)`],
    ["Anim"         , `new Anim(animation, duration, easing, endCallback)`],
    ["Canvas"       , `new Canvas(cvs, loopingCB, fpsLimit, visibilityChangeCB, cvsFrame, settings, willReadFrequently)`],
    ["Color"        , `new Color(color, isChannel)`],
    ["Gradient"     , `new Gradient(ctx, positions, colorStops, type, rotation)`],
    ["Mouse"        , `constructor()`],
    ["Pattern"      , `new Pattern(render, source, positions, sourceCroppingPositions, keepAspectRatio, forcedUpdates, rotation, errorCB, readyCB, frameRate, repeatMode)`],
    ["Render"       , `constructor(ctx)`],
    ["RenderStyles" , `new RenderStyles(render, color, filter, compositeOperation, opacity, lineWidth, lineDash, lineDashOffset, lineJoin, lineCap)`],
    ["TextStyles"   , `new TextStyles(render, font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, fontKerning, textAlign, textBaseline, textRendering)`],
    ["TypingDevice" , `constructor()`],
    ["AudioDisplay" , `new AudioDisplay(source, pos, color, binCB, sampleCount, disableAudio, offsetPourcent, errorCB, setupCB, loopCB, anchorPos, alwaysActive)`],
    ["Dot"          , `new Dot(pos, radius, color, setupCB, anchorPos, alwaysActive, disablePathCaching)`],
    ["FilledShape"  , `new FilledShape(fillColor, dynamicUpdates, pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, alwaysActive, fragile)`],
    ["Grid"         , `new Grid(keys, gaps, spacing, source, pos, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, alwaysActive, fragile)`],
    ["ImageDisplay" , `new ImageDisplay(source, pos, size, errorCB, setupCB, loopCB, anchorPos, alwaysActive)`],
    ["Shape"        , `new Shape(pos, dots, radius, color, limit, drawEffectCB, ratioPosCB, setupCB, loopCB, anchorPos, alwaysActive, fragile)`],
    ["TextDisplay"  , `new TextDisplay(text, pos, color, textStyles, drawMethod, maxWidth, setupCB, loopCB, anchorPos, alwaysActive)`],
    ["FPSCounter"   , `new FPSCounter(avgSampleSize)`],
    ["drawEffectCB" , `(render, dot, ratio, parentSetupResults, mouse, distance, parent, isActive)=>{}`],
    ["setupCB"      , `(obj, parent)=>{}`],
    ["loopCB"       , `(obj)=>{}`],
    ["initPos"      , `(cvs, obj)=>[x, y]`],
    ["initRadius"   , `(parent or obj)=>radiusValue`],
    ["initColor"    , `(render, obj)=>colorValue`],
    ["anchorPos"    , `(obj, cvs or parent)=>[x,y]`],
], s_ll = signatures.length, a_ll = process.argv.length

function logSignature(arg) {
    if (arg == "*") arg = ""
    signatures.filter(s=>s[0].toLowerCase().includes(arg)).forEach(([name, signature])=>console.log(`\n${(name+":").padEnd(15)}${signature}\n`))

}

for (let i=2;i<a_ll;i++) {
    const arg = process.argv[i].toLowerCase()
    logSignature(arg)
}