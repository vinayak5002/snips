function preprocess(text) {
  if(text !== undefined)
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "") // Remove non-alphabetic characters
    .split(/\s+/); // Split by spaces into tokens
}

function calculateTF(document) {
  const words = preprocess(document);
  const termFrequency = {};

  words.forEach((word) => {
    if (termFrequency[word]) {
      termFrequency[word] += 1;
    } else {
      termFrequency[word] = 1;
    }
  });

  // Convert counts to frequencies
  for (let word in termFrequency) {
    termFrequency[word] /= words.length;
  }

  return termFrequency;
}

function calculateIDF(documents) {
  const idf = {};
  const totalDocs = documents.length;

  documents.forEach((document) => {
    const words = new Set(preprocess(document));
    words.forEach((word) => {
      if (idf[word]) {
        idf[word] += 1;
      } else {
        idf[word] = 1;
      }
    });
  });

  // Convert counts to IDF scores
  for (let word in idf) {
    idf[word] = Math.log(totalDocs / idf[word]);
  }

  return idf;
}

function calculateTFIDF(document, idf) {
  const tf = calculateTF(document);
  const tfidf = {};

  for (let word in tf) {
    if (idf[word]) {
      tfidf[word] = tf[word] * idf[word];
    } else {
      tfidf[word] = 0;
    }
  }

  return tfidf;
}

function cosineSimilarity(tfidf1, tfidf2) {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let word in tfidf1) {
    dotProduct += (tfidf1[word] || 0) * (tfidf2[word] || 0);
    magnitude1 += (tfidf1[word] || 0) ** 2;
  }

  for (let word in tfidf2) {
    magnitude2 += (tfidf2[word] || 0) ** 2;
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 && magnitude2) {
    return dotProduct / (magnitude1 * magnitude2);
  } else {
    return 0;
  }
}

function searchDocuments(documents, query) {
  // Preprocess the documents and query
  const documentContents = documents.map(
    (doc) => doc.filePath + " " + doc.lang + " " + doc.code
  );

  const idf = calculateIDF(documentContents);
  const queryTFIDF = calculateTFIDF(query, idf);

  // Calculate TF-IDF for each document
  const scores = documents.map((doc, index) => {
    const docTFIDF = calculateTFIDF(documentContents[index], idf);
    return {
      document: doc,
      score: cosineSimilarity(queryTFIDF, docTFIDF),
    };
  });

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  // Return documents sorted by score
  return scores.map((score) => score.document);
}

module.exports = {
  calculateTF,
  calculateIDF,
  calculateTFIDF,
  cosineSimilarity,
  searchDocuments,
};