const fs = require("fs");
const { readDirectoryRecursive } = require("./fileUtils");
const { calculateIDF } = require("./tf-idf");
const templates = require("../constants/templates");
const path = require("path");
const crypto = require("crypto");

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

const ensureDataExists = () => {
  dataPath = path.join(__dirname, "../", "data.json");

  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify(templates.data, null, 2));
    console.log("Data file created");

    return;
  }

  console.log("Data file already exists");
}

const reIndexRepo = async (repoPath, idfFileName, documentFileName) => {
  // get the documents in the repo
  documentList = readDirectoryRecursive(repoPath, repoPath);

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
}

const getIndexedFileNames = (folderPath) => {

  // Normalize the folder path
  const normalizedPath = path.normalize(folderPath);

  // Create a hash of the folder path
  const hash = crypto.createHash('sha256').update(normalizedPath).digest('hex');


  const idfFileName = path.join(
    __dirname,
    "../idfs",
    `idf-${hash}.json`
  );
  const documentFileName = path.join(
    __dirname,
    "../documents",
    `documents-${hash}.json`
  );

  return { idfFileName, documentFileName };
}

const deleteIndexedFiles = (repoId) => {
  const { idfFileName, documentFileName } = getIndexedFileNames(repoId);

  fs.unlinkSync(idfFileName);
  fs.unlinkSync(documentFileName);
}

module.exports = {
  ensureDirectoryExists,
  checkIsDirectoryExists,
  reIndexRepo,
  getIndexedFileNames,
  ensureDataExists,
  deleteIndexedFiles
};
