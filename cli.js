#!/usr/bin/env node

import { startServer } from "./server";

const args = process.argv.slice(2)

const command = args[0]

if (command === 'start') {
    startServer(args[1])
    console.log("Server has started");
    
} else if (command === 'connect') {
    console.log("A new client is connecting");
    
} else {
    console.log("Unknown Command. Use 'Start' or 'Connect'");
    
}