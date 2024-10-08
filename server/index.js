const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { readDirectoryRecursive } = require("./utils/fileUtils.js");
const { searchDocuments, calculateIDF } = require("./utils/tf-idf.js");
const app = express();
const port = 5000;

// Basic CORS configuration
app.use(cors());

app.get("/current-repo", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "user.json"), "utf8");
  const user = JSON.parse(data);

  console.log(user)
  res.send(user.currentRepoPath);
});

app.post("/current-repo", (req, res) => {
  const { repoPath } = req.path;
  console.log("POST: update user currrent repo path: ", repoPath);

  // read the file user.json
  const data = fs.readFileSync(path.join(__dirname, "user.json"), "utf8");
  const user = JSON.parse(data);

  // update the repoPath
  user.repoPath = repoPath;

  // save the file
  fs.writeFileSync(path.join(__dirname, "user.json"), JSON.stringify(user, null, 2));
  
  res.send("Repo path updated");
});

app.get("/saved-repos", (req, res) => {

  const data = fs.readFileSync(path.join(__dirname, "user.json"), "utf-8");
  const user = JSON.parse(data);

  console.log("Sending: ", user.repos);

  res.send(user.repos);
});

app.get("/search", (req, res) => {
  const {query} = req.query;
  console.log(query);

  // read the file user.json
  const data = fs.readFileSync(path.join(__dirname, "user.json"), "utf8");
  const user = JSON.parse(data);

  const currentRepo = user.currentRepoPath;
  const repoId = user.repos.findIndex((repo) => repo.path === currentRepo);

  const idfFileName = path.join(__dirname, "idfs", `idf-${repoId}.json`);
  const documentFileName = path.join(__dirname, "documents", `documents-${repoId}.json`);

  var idf;
  var documentList;

  // check if the repo is already indexed
  if (!fs.existsSync(idfFileName)) {
    // get the documents in the repo
    documentList = readDirectoryRecursive(currentRepo);
    
    // calculate the idf
    const documentContents = documentList.map(
      (doc) => doc.filePath + " " + doc.lang + " " + doc.code
    );
    idf = calculateIDF(documentContents);

    // save the idf and document list 
    fs.writeFileSync(idfFileName, JSON.stringify(idf, null, 2));
    fs.writeFileSync(documentFileName, JSON.stringify(documentList, null, 2));
  }
  else {
    // read the idf and document list if its already saved 
    idf = JSON.parse(fs.readFileSync(idfFileName, "utf8"));
    documentList = JSON.parse(fs.readFileSync(documentFileName, "utf8"));
  }

  // search the documents
  const results = searchDocuments(documentList, idf, query);

  res.send(results);
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
