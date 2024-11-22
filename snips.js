#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require("fs");
const path = require('path');
const args = process.argv.slice(2);
require('dotenv').config();  

const PORT = process.env.PORT || 3000;

if (args[0] === 'start') {
  const serverDir = path.join(__dirname, 'server');

  exec(`cd ${serverDir} && npm run start`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
    console.log('To change the port, run "snips start --port=3001"');
    return;
  });

  console.log('Starting server...');
  console.log(`Started server in port: ${PORT}`)
  console.log(`Go to: http://localhost:${PORT}`)
} else if (args[0] === 'update') {
  const rootDir = __dirname;

  exec(`echo Updating... && cd ${rootDir} && git pull`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });

  console.log("Rebuilding app...");
  reBuildApp();

} else if (args[0] === 'install') {
  exec('echo "Installing server dependencies" && cd server && npm install && echo "Installing client dependencies" && cd ../client && npm install && echo "Building client" && npm run build', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
} else if (args[0] === 'set-port') {
  const newPort = args[1];
  updateConfigPort(newPort);
} else {
  console.log('Unknown command. Please use "start", "update", or "install".');
}

function updateConfigPort(newPort) {
  const configPath = path.join(__dirname, 'config.js');
  const clientConstantPath = path.join(__dirname, 'client', 'src', 'constants', 'serverPort.ts');

  const newConfigContent = `
module.exports = {
  PORT: ${newPort}, // Dynamically set port
};`
;

  const newClientServerPort = `export const SERVER_PORT = ${newPort};`;

  fs.writeFileSync(configPath, newConfigContent, 'utf-8');
  fs.writeFileSync(clientConstantPath, newClientServerPort, 'utf-8');

  console.log(`Port updated to ${newPort}`);
}

function reBuildApp() {
  const rootDir = __dirname;

  exec(`echo Re-building && cd ${rootDir} && npm run update`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      console.error(`Stderror: ${stderr}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
}