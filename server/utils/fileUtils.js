const fs = require('fs');
const path = require('path');

function preprocess(text) {
  return text.replace(/[\\]+/g, ' ');
}

// Function to parse snippets from a file
function parseSnippetsFromFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const lines = data.split("\n");
  let snippet = "";
  let snippetName = "";
  let inSnippet = false;
  const snippets = [];

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (inSnippet) {
        // End of snippet
        snippets.push({
          lang: snippetName,
          code: snippet.trim(), // Ensure no trailing newline
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
    });
  }

  return {
    file: filePath,
    snippets: snippets,
  };
}

// Function to recursively read files in a directory
function readDirectoryRecursive(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(readDirectoryRecursive(filePath)); // Recursively read subdirectory
    } else {
      // If it is a markdown file, parse it
      if (file.endsWith(".md")) {
        const snippetsFromFile = parseSnippetsFromFile(filePath);

        const snippetDocuments = snippetsFromFile.snippets.map((snip) => {
          return {
            filePath: preprocess(snippetsFromFile.file), // Use original file path here
            lang: snip.lang,
            code: snip.code, // Preprocess the code
          };
        });

        results = results.concat(snippetDocuments);
      }
    }
  });

  return results;
}

// Export both functions
module.exports =  { parseSnippetsFromFile, readDirectoryRecursive };
