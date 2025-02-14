const fs = require("fs");
const path = require("path");

// Function to parse snippets from a file
function parseSnippetsFromFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const lines = data.split("\n");
  let snippet = "";
  let snippetName = "";
  let inSnippet = false;
  const snippets = [];

  let stk = [];

  const updateHeaderStack = (header, lineNumber) => {
    const splitHeader = header.split(" ");
    const level = splitHeader[0].length;
    const title = splitHeader.slice(1).join(" ");

    const newHeader = {
      level: level,
      title: title,
      lineNumber: lineNumber,
    };

    while (stk.length && stk[stk.length - 1].level >= newHeader.level) {
      stk.pop();
    }

    //console.log(stk);
    //console.log(header);
    stk.push(newHeader);
  };

  const getHeaderTree = () => {
    if (stk.length === 0) return ""; // Handle empty stack
    // console.log(stk)
    return stk.map((e) => e.title).join(" ");
  };

  const getHeaderLine = () => {
    if (stk.length === 0) return ""; // Handle empty stack
    //console.log(stk[stk.length - 1]);
    return stk[stk.length - 1].lineNumber;
  };

  lines.forEach((line, index) => {
    if (line.match(/^#+/)) {
      updateHeaderStack(line ,index);
    }

    if (line.startsWith("```")) {
      if (inSnippet) {
        // End of snippet
        snippets.push({
          lang: snippetName,
          code: snippet.trim(),
          headerTree: getHeaderTree(),
          headerLine: getHeaderLine(),
        });
        snippet = "";
        snippetName = "";
      } else {
        // Start of snippet
        snippetName = line.substring(3).trim();
      }
      inSnippet = !inSnippet;
    } else if (inSnippet) {
      // Inside a snippet
      snippet += line + "\n";
    }
  });

  // Handle case where file ends with an open snippet
  if (inSnippet) {
    snippets.push({
      lang: snippetName,
      code: snippet.trim(), // Ensure no trailing newline
      headerTree: getHeaderTree(),
    });
  }

  return {
    file: filePath,
    snippets: snippets,
  };
}

// Function to recursively read files in a directory
function readDirectoryRecursive(dir, rootPath, endsWith = ["md"]) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(readDirectoryRecursive(filePath, rootPath)); // Recursively read subdirectory
    } else {
      // If it is a markdown file, parse it
      if (file.split(".").at(-1).includes(endsWith)) {
        const snippetsFromFile = parseSnippetsFromFile(filePath);

        const snippetDocuments = snippetsFromFile.snippets.map((snip) => {
          const splitCurrentRepoPath = rootPath.split("\\");
          const splitFilePath = snippetsFromFile.file.split("\\");
          const filePath = splitFilePath
            .filter((item) => !splitCurrentRepoPath.includes(item))
            .join(" ");

          return {
            filePath: filePath,
            lang: snip.lang,
            code: snip.code,
            headerTree: snip.headerTree,
            metaData: {
              headerLine: snip.headerLine,
              actualFilePath: snippetsFromFile.file,
            }
          };
        });

        results = results.concat(snippetDocuments);
      }
    }
  });

  return results;
}

const checkFileChanges = (directoryPath, timestamp) => {
  // Convert the timestamp to a Date object for comparison
  const timestampDate = new Date(timestamp);

  // Read the files and subdirectories in the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Loop through each file/subdirectory
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      // Get the stats of the file or directory
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error fetching file stats:', err);
          return;
        }

        // If it's a directory, recurse into it
        if (stats.isDirectory()) {
          checkFileChanges(filePath, timestamp); // Recursively check inside subdirectories
        } else {
          // Check if the file was modified after the provided timestamp
          if (stats.mtime > timestampDate) {
            console.log(`File changed: ${filePath}, Modified at: ${stats.mtime}`);
            return true;
          }
        }
      });
    });
  });

  return false;
}

// Export both functions
module.exports = { parseSnippetsFromFile, readDirectoryRecursive, checkFileChanges};
