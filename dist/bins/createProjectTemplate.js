#!/usr/bin/env node
import {readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync, readFileSync} from "fs"
import {join, dirname} from "path"
import {fileURLToPath} from "url"

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

// Copy template
const destination = join(process.cwd(), process.argv[2]||"")
mkdirSync(destination, {recursive:true})
copyFolder(join(dirname(fileURLToPath(import.meta.url)), "src/projectTemplate"), destination)

// Add gitignore
writeFileSync(join(destination, ".gitignore"), `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.env*`)

console.log("Template project created at '"+destination+"'!")