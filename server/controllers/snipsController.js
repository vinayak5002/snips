const fs = require("fs");
const path = require("path");

const snipsService = require("../services/snipService.js");
const snipUtils = require("../utils/utils.js");

const { searchDocuments } = require("../utils/tf-idf.js");
const { checkIsDirectoryExists } = require("../utils/utils.js");

const getCurrentRepo = (req, res) => {
  console.log("GET: /current-repo");

  const currentRepo = snipsService.getCurrentRepo();

  console.log(currentRepo);
  res.send(currentRepo);
};

const setCurrentRepo = (req, res) => {
  console.log("POST: /current-repo", req.body);

  const { newRepoPath } = req.body;

  if (!newRepoPath) {
    return res.status(400).send("Path is required");
  }

  // Set new current repo
  const currentRepo = snipsService.updateCurrentRepoIndex(newRepoPath);

  // Re-index repo if not indexed
  if (currentRepo.lastIndexed === null) {
    const { idfFileName, documentFileName } = snipUtils.getIndexedFileNames(newRepoPathIndex);
    snipUtils.reIndexRepo(currentRepo.path, idfFileName, documentFileName);
  }

  console.log("Updated current repo: ", currentRepo);

  res.send(currentRepo);
};

const getSavedRepos = (req, res) => {
  console.log("GET: /saved-repos");

  const savedRepos = snipsService.getSavedRepos();

  res.send(savedRepos);
};

const searchSnips = (req, res) => {
  console.log("GET: /search-snips", req.query);

  const { query } = req.query;
  console.log(query);

  // Get the current repo index
  const repoId = snipsService.getCurrentRepoIndex();

  // Get indexed files
  const { idfFileName, documentFileName } = snipUtils.getIndexedFileNames(repoId);

  // Get the idfs and document list
  const idf = JSON.parse(fs.readFileSync(idfFileName, "utf8"));
  const documentList = JSON.parse(fs.readFileSync(documentFileName, "utf8"));

  // search the documents
  const results = searchDocuments(documentList, idf, query);

  res.send(results);
};

const reindexDocuments = (req, res) => {
  console.log("GET: /re-index");

  // Get the current repo index
  const repoId = snipsService.getCurrentRepoIndex();

  // file paths for saving idf and document list
  const { idfFileName, documentFileName } = snipUtils.getIndexedFileNames(repoId);

  // Get the current repo path
  const currentRepoPath = snipsService.getCurrentRepo().path;

  console.log("current repo path: ", currentRepoPath);

  // Re-index the repo
  snipUtils.reIndexRepo(currentRepoPath, idfFileName, documentFileName);

  // update the last indexed time
  snipsService.updateRepoLastIndexedTime(repoId);

  res.send("Re-indexed");
};

const checkRepoPath = (req, res) => {
  console.log("GET: /check-repo-path", req.query);

  const { repoPath } = req.query;

  if (!repoPath) {
    return res.status(400).send("Path is required");
  }

  res.send(checkIsDirectoryExists(repoPath));
}

const addRepo = (req, res) => {
  console.log("POST: /add-repo", req.body);

  const { repoPath } = req.body;

  if (!repoPath) {
    return res.status(400).send("Path is required");
  }

  const newRepo = snipsService.addRepo(repoPath);

  res.send(newRepo);
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
  getFile
};
