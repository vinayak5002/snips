const fs = require("fs");

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    // Create the directory, including any parent directories that don't exist
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Newly Directory created: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
};

const checkIsDirectoryExists = (dir) => {
  console.log(`Checking if directory exists: ${dir}`);
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return false;
  } else {
    console.log(`Directory exists: ${dir}`);
    return true;
  }
}

module.exports = {
  ensureDirectoryExists,
  checkIsDirectoryExists
};
