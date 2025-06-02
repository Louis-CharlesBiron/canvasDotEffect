#!/usr/bin/env node
import {copyFileSync} from "fs"
import {dirname, join} from "path"
import {fileURLToPath} from "url"

copyFileSync(join(dirname(fileURLToPath(import.meta.url)), "./src/CDECanvas.jsx"), join(process.cwd(), "CDECanvas.jsx"))

console.log("Default CDECanvas React component created!")

// TODO, open explorer thing
