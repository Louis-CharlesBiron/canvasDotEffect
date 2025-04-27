#!/usr/bin/env node
import {readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync, readFileSync} from "fs"
import {join} from "path"

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

const destination = join(process.cwd(), process.argv[2]||"")
mkdirSync(destination, {recursive:true})
copyFolder(join(import.meta.dirname, "src/projectTemplate"), destination)

const gitignorePath = join(destination, ".gitignore")
writeFileSync(gitignorePath, readFileSync(gitignorePath, "utf8").replace(`node_modules`, `node_modules\nbin`))

console.log("Template project created at '"+destination+"'!")