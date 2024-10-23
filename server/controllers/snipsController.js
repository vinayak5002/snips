const fs = require("fs");
const path = require("path");

const { reIndexRepo } = require("../utils/utils.js");
const { searchDocuments, calculateIDF } = require("../utils/tf-idf.js");
const { checkIsDirectoryExists } = require("../utils/utils.js");

const getCurrentRepo = (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "../user.json"), "utf8");
  const user = JSON.parse(data);

  console.log(user);
  res.send(user.currentRepoPath);
};

const setCurrentRepo = (req, res) => {
  console.log("Received post request: ", req.body);
  const { newRepoPath } = req.body;

  if (!newRepoPath) {
    return res.status(400).send("Path is required");
  }

  const data = fs.readFileSync(path.join(__dirname, "../user.json"), "utf8");
  const user = JSON.parse(data);

  console.log("User object before update:", user);

  // Update the repoPath
  user.currentRepoPath = newRepoPath; // Assuming you want to update this field

  // Log the modified user object
  console.log("User object after update:", user);

  // Write the updated user object back to the file
  fs.writeFileSync(
    path.join(__dirname, "../user.json"),
    JSON.stringify(user, null, 2)
  );

  res.send(user.currentRepoPath);
};

const getSavedRepos = (req, res) => {
  console.log("GET: /saved-repos");
  const data = fs.readFileSync(path.join(__dirname, "../user.json"), "utf-8");
  const user = JSON.parse(data);

  console.log("Sending: ", user.repos);

  res.send(user.repos);
};

const searchSnips = (req, res) => {
  const { query } = req.query;
  console.log(query);

  // read the file user.json
  const data = fs.readFileSync(path.join(__dirname, "../user.json"), "utf8");
  const user = JSON.parse(data);

  const currentRepo = user.currentRepoPath;
  const repoId = user.repos.findIndex((repo) => repo.path === currentRepo);

  const idfFileName = path.join(__dirname, "../idfs", `idf-${repoId}.json`);
  const documentFileName = path.join(
    __dirname,
    "../documents",
    `documents-${repoId}.json`
  );

  var idf;
  var documentList;

  // check if the repo is already indexed
  if (!fs.existsSync(idfFileName) || !fs.existsSync(documentFileName)) { // if not indexed

    reIndexRepo(currentRepo, idfFileName, documentFileName);

  } else { // if indexed
    // read the idf and document list if its already saved
    idf = JSON.parse(fs.readFileSync(idfFileName, "utf8"));
    documentList = JSON.parse(fs.readFileSync(documentFileName, "utf8"));
  }

  // search the documents
  const results = searchDocuments(documentList, idf, query);

  res.send(results);
};

const reindexDocuments = (req, res) => {
  // read the file user.json
  const data = fs.readFileSync(path.join(__dirname, "../user.json"), "utf8");
  const user = JSON.parse(data);

  const currentRepoPath = user.currentRepoPath;
  const repoId = user.repos.findIndex((repo) => repo.path === currentRepoPath);

  // file paths for saving idf and document list
  const idfFileName = path.join(__dirname, "../idfs", `idf-${repoId}.json`);
  const documentFileName = path.join(
    __dirname,
    "../documents",
    `documents-${repoId}.json`
  );

  reIndexRepo(currentRepoPath, idfFileName, documentFileName);

  res.send("Re-indexed");
};

const checkRepoPath = (req, res) => {
  const { repoPath } = req.query;

  if (!repoPath) {
    return res.status(400).send("Path is required");
  }

  res.send(checkIsDirectoryExists(repoPath));
}

const addRepo = (req, res) => {
  const { repoPath } = req.body;

  console.log(repoPath)

  if (!repoPath) {
    return res.status(400).send("Path is required");
  }

  // read the file user.json
  const data = fs.readFileSync(path.join(__dirname, "../user.json"), "utf8");
  const user = JSON.parse(data);

  user.repos.push({ path: repoPath });

  // Write the updated user object back to the file
  fs.writeFileSync(
    path.join(__dirname, "../user.json"),
    JSON.stringify(user, null, 2)
  );

  res.send(user.repos);
}

const getHeaderSection = (req, res) => {
  const { lineNumber, filePath } = req.query;

  if (typeof lineNumber !== 'string' || !filePath) {
    return res.status(400).send('Invalid request parameters.');
  }

  const lineNum = parseInt(lineNumber, 10);
  if (isNaN(lineNum)) {
    return res.status(400).send('Line number must be a valid integer.');
  }

  let section = "";

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const lines = data.split("\n");

    if (lineNum < 0 || lineNum >= lines.length) {
      return res.status(400).send('Line number out of bounds.');
    }

    const headerLevel = (lines[lineNum].match(/^#+/) || [''])[0].length;

    for (let i = lineNum + 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^#+/)) {
        if (line.match(/^#+/)[0].length >= headerLevel) {
          break;
        }
      } else {
        section += line + "\n";
      }
    }

    res.send(section);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Internal server error.');
  }
}

const getFile = (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).send('File path is required.');
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.send(data);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Internal server error.');
  }
}

module.exports = {
  getCurrentRepo,
  setCurrentRepo,
  getSavedRepos,
  searchSnips,
  reindexDocuments,
  checkRepoPath,
  addRepo,
  getHeaderSection,
  getFile
};
