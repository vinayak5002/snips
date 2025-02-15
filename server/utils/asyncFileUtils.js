const fs = require('fs').promises;
const path = require('path');

const checkFileChanges = async (directoryPath, timestamp) => {
  try {
    // Convert the timestamp to a Date object for comparison
    const timestampDate = new Date(timestamp);

    // Read the files and subdirectories in the directory
    console.log("Checking for file changes in", directoryPath);
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      // Get the stats of the file or directory
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        // Recursively check inside subdirectories
        if (await checkFileChanges(filePath, timestamp)) {
          return true; // If any file in the directory is modified, return true
        }
      } else if (stats.mtime > timestampDate) {
        return true; // If any file is modified, return true
      }
    }
    
    return false; // No files were modified
  } catch (err) {
    console.error('Error:', err);
    return false;
  }
};

module.exports = { checkFileChanges };