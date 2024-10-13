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

module.exports = {
  ensureDirectoryExists,
};
