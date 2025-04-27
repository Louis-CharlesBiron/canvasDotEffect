#!/usr/bin/env node
import {copyFileSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from "fs"
import {extname, join} from "path"
import {cwd} from "process"

function copyFolder(src, dest) {
    const filepaths = readdirSync(src, {recursive:true}), f_ll = filepaths.length
    for (let i=0;i<f_ll;i++) {
        const filepath = join(src, filepaths[i]), destPath = join(dest, filepaths[i])
        if (statSync(filepath).isDirectory()) {
            mkdirSync(destPath, {recursive:true})
            copyFolder(filepath, destPath)
        } else copyFileSync(filepath, destPath)
    }
}

// Add async attribute to main script
const indexHtmlPath = join(cwd(), "dist/index.html")
writeFileSync(indexHtmlPath, readFileSync(indexHtmlPath, "utf8").replace(`type="module" crossorigin`, `type="module" async crossorigin`))

// Add user medias
const defaultFolders = ["dist", "bin", "node_modules"],
      userMediasExtensions = ["mp3","wav","ogg","aac","m4a","opus","flac","jpg","jpeg","png","gif","svg","webp","bmp","tiff","ico","heif","heic","mp4","webm","ogv","mov","avi","mkv","flv","wmv","3gp","m4v"], 
      source = process.cwd()

readdirSync(source).filter(filepath=>{
    const fullPath = join(source, filepath)
    return statSync(fullPath).isDirectory() && !defaultFolders.includes(filepath) && readdirSync(fullPath).some(file=>userMediasExtensions.includes(extname(file).replace(".","")))
}).forEach(folder=>{
    const destination = join(source, "dist", folder)
    mkdirSync(destination, {recursive:true})
    copyFolder(join(source, folder), destination)
})

console.log("Build completed!")