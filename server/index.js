const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { readDirectoryRecursive } = require("./utils/fileUtils.js");
const { searchDocuments } = require("./utils/tf-idf.js");
const app = express();
const port = 5000;

// Basic CORS configuration
app.use(cors());
// Express route to handle the repository request
app.get("/repos/:id", (req, res) => {
  // Start timing
  console.time("repoFetchTime");

  const index = req.params.id;

  try {
    const data = fs.readFileSync(path.join(__dirname, "repos.json"), "utf8");
    const repos = JSON.parse(data);

    if (!repos || !repos[index]) {
      res.status(404).send("Repo not found");
      // End timing and log duration
      console.timeEnd("repoFetchTime");
      return;
    }

    const repoPath = repos[index].path;

    if (!fs.existsSync(repoPath)) {
      res.status(404).send("Directory not found");
      // End timing and log duration
      console.timeEnd("repoFetchTime");
      return;
    }

    const directoryList = readDirectoryRecursive(repoPath);

    //save the response to a file
    fs.writeFileSync(
      path.join(__dirname, "documents.json"),
      JSON.stringify(directoryList, null, 2)
    );

    res.json(directoryList);

    // End timing and log duration
    console.timeEnd("repoFetchTime");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");

    // End timing and log duration
    console.timeEnd("repoFetchTime");
  }
});

app.get("/search", (req, res) => {
  const {query} = req.query;
  console.log(query);

  // read documents form the file
  const documents = JSON.parse(
    fs.readFileSync(path.join(__dirname, "documents.json"), "utf8")
  );

  // search the documents
  const results = searchDocuments(documents, query);

  res.send(results);
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
