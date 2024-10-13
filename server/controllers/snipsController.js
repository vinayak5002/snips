const fs = require("fs");
const path = require("path");

const { readDirectoryRecursive } = require("../utils/fileUtils.js");
const { searchDocuments, calculateIDF } = require("../utils/tf-idf.js");

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
    path.join(__dirname, "user.json"),
    JSON.stringify(user, null, 2)
  );

  res.send(user.currentRepoPath);
};

const getSavedRepos = (req, res) => {
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
  if (!fs.existsSync(idfFileName) || !fs.existsSync(documentFileName)) {
    // get the documents in the repo
    documentList = readDirectoryRecursive(currentRepo, currentRepo);

    // convert documents into text
    const documentContents = documentList.map(
      (doc) =>
        doc.headerTree + " " + doc.filePath + " " + doc.lang + " " + doc.code
    );

    // calculating idfs using the documents
    idf = calculateIDF(documentContents);

    // save the idf and document list
    fs.writeFileSync(idfFileName, JSON.stringify(idf, null, 2));
    fs.writeFileSync(documentFileName, JSON.stringify(documentList, null, 2));
  } else {
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

  // get the documents in the repo
  const documentList = readDirectoryRecursive(currentRepoPath, currentRepoPath);

  // convert documents into text
  const documentContents = documentList.map(
    (doc) =>
      doc.headerTree + " " + doc.filePath + " " + doc.lang + " " + doc.code
  );

  // calculating idfs using the documents
  const idf = calculateIDF(documentContents);

  // save the idf and document list
  fs.writeFileSync(idfFileName, JSON.stringify(idf, null, 2));
  fs.writeFileSync(documentFileName, JSON.stringify(documentList, null, 2));

  res.send("Re-indexed");
};

module.exports = {
  getCurrentRepo,
  setCurrentRepo,
  getSavedRepos,
  searchSnips,
  reindexDocuments,
};
