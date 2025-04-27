#!/usr/bin/env node
import {copyFileSync} from "fs"
import {join} from "path"

copyFileSync(join(import.meta.dirname, "./src/CDECanvas.jsx"), join(process.cwd(), "CDECanvas.jsx"))

console.log("Default CDECanvas React component created!")
