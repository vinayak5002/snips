#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require("fs");
const path = require('path');
const args = process.argv.slice(2);
const dotenv = require('dotenv');

// Load the .env file from the "server" folder
dotenv.config({ path: path.resolve(__dirname, 'server', '.env') });

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
  });

  console.log('Starting server...');
  console.log(`Started server in port: ${PORT}`)
  console.log(`Go to: http://localhost:${PORT}`)
  console.log('To change the port, run "snips start --port=3001"');
}

else if (args[0] === 'update') {
  const rootDir = __dirname;

  exec(`echo Updating... && cd ${rootDir} && git pull`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);

    console.log("Installing updates...");

    exec(`echo Installing server dependencies && cd ${rootDir} && npm run install`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${err}`);
        return;
      }

      console.log("Installation complete.");
    });
  });
}

else if (args[0] === 'set-port') {
  const newPort = args[1];
  updateConfigPort(newPort);
}

else {
  console.log('Unknown command. Please use "start, "update", or "set-port".');
}

function updateConfigPort(newPort) {
  const serverEnv = path.join(__dirname, 'server', '.env');
  const clientEnv = path.join(__dirname, 'client', '.env');

  const newServerEnvContent = `PORT=${newPort}`;
  const newClientEnvContent = `VITE_PORT=${newPort}`

  fs.writeFileSync(serverEnv, newServerEnvContent, 'utf-8');
  fs.writeFileSync(clientEnv, newClientEnvContent, 'utf-8');

  console.log(`Port updated to ${newPort}`);

  reBuildApp();
}

function reBuildApp() {
  console.log("Rebuilding app...");
  const rootDir = __dirname;

  console.log(`echo Re-building && cd ${rootDir} && npm run update`);

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