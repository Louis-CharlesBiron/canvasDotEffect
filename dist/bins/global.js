#!/usr/bin/env node
import {spawn} from "child_process"
import {dirname, join} from "path"
import {createInterface} from "readline"

const commands = {
        "template": "createProjectTemplate.min.js",
        "t": "createProjectTemplate.min.js",
        "browser-template": "createBrowserProjectTemplate.min.js",
        "bt": "createBrowserProjectTemplate.min.js",
        "react": "createDefaultReactComponent.min.js",
        "doc": "openDocumentation.min.js",
        "documentation": "openDocumentation.min.js",
        "signature": "getSignature.min.js",
        "sig": "getSignature.min.js",
        "s": "getSignature.min.js",
    }, customCommands = ["list"]

function getCommand(reqCom, params) {
    const isDirectFind = Boolean(commands[reqCom]), cmd = Object.entries(commands).find((command)=>command[0].toLowerCase().includes(reqCom))
    if (customCommands.includes(reqCom)) return {cmd:reqCom}
    else if (cmd && reqCom && reqCom != "cdejs") return {isAutoComplete:!isDirectFind&&!params.includes("-y")&&!params.includes("-f"), cmdName:cmd[0], cmd:[join(dirname(process.argv[1]), cmd[1]), ...params.filter(x=>!x.includes("-y")&&!x.includes("-f"))].filter(Boolean)}
}

function executeCmd(cmd) {
    if (cmd=="list") {console.log(`NPX:
    ${Object.keys(commands).join("\n    ")}
CUSTOM:
    ${customCommands.join("\n    ")}
`)}
    else spawn("node", cmd, {stdio:"inherit"}) 
}

const command = getCommand(process.argv[2]?.toLowerCase().trim(), process.argv.slice(3))

if (command) {
    if (command.isAutoComplete) {
        const cli = createInterface({input:process.stdin, output:process.stdout})
        function close(cli) {
            cli.close()
            console.log("")
        }
        
        cli.question("The command was autocompleted to 'cdejs-"+command.cmdName+"', continue [Y/N]? ", value=>{
            const v = value?.toLowerCase()?.trim()
            if (!v || ["y", "yes", "ye", "ok", "for sure"].includes(v)) {
                close(cli)
                executeCmd(command.cmd)
            }
        })
        
        process.stdin.on("keypress", (_, key) => {
            if (key.name == "escape") close(cli)
        })
    } else executeCmd(command.cmd)
} else console.log("\n'"+process.argv[2]?.toLowerCase()+"' is not part of any cdejs command...\n")