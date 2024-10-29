function preprocess(text, n = 3) {
  if (text !== undefined) {
    text = text.toLowerCase().replace(/[^a-z\s]/g, ""); // Remove non-alphabetic characters
    const ngrams = [];

    for (let i = 0; i <= text.length - n; i++) {
      ngrams.push(text.substring(i, i + n)); // Generate n-grams of length n
    }

    return ngrams.length ? ngrams : [text]; // If ngrams is empty, return the cleaned text
  }
  return [];
}

function calculateTF(document, n = 3) {
  const ngrams = preprocess(document, n);
  const termFrequency = {};
  const totalNgrams = ngrams.length;

  ngrams.forEach((ngram, index) => {
    if (ngram) {
      // Calculate position score (1 for the first ngram, 0 for the last ngram)
      const positionScore = (totalNgrams - index) / totalNgrams;

      // Calculate weighted frequency based on position
      if (termFrequency[ngram]) {
        termFrequency[ngram] += positionScore;
      } else {
        termFrequency[ngram] = positionScore;
      }
    }
  });

  // Convert counts to frequencies by normalizing with the sum of all position scores
  const totalPositionScores = Object.values(termFrequency).reduce(
    (sum, val) => sum + val,
    0
  );
  for (let ngram in termFrequency) {
    termFrequency[ngram] /= totalPositionScores;
  }

  return termFrequency;
}

function calculateIDF(documents, n = 3) {
  const idf = {};
  const totalDocs = documents.length;

  documents.forEach((document) => {
    // console.log(document)
    const ngrams = new Set(preprocess(document, n));
    ngrams.forEach((ngram) => {
      if (idf[ngram]) {
        idf[ngram] += 1;
      } else {
        idf[ngram] = 1;
      }
    });
  });

  // Convert counts to IDF scores
  for (let ngram in idf) {
    idf[ngram] = Math.log(totalDocs / idf[ngram]);
  }
  // console.log(idf)
  return idf;
}

function calculateTFIDF(document, idf, n = 3) {
  const tf = calculateTF(document, n);
  const tfidf = {};

  for (let ngram in tf) {
    if (idf[ngram]) {
      tfidf[ngram] = tf[ngram] * idf[ngram];
    } else {
      tfidf[ngram] = 0;
    }
  }

  return tfidf;
}

function cosineSimilarity(tfidf1, tfidf2) {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let ngram in tfidf1) {
    dotProduct += (tfidf1[ngram] || 0) * (tfidf2[ngram] || 0);
    magnitude1 += (tfidf1[ngram] || 0) ** 2;
  }

  for (let ngram in tfidf2) {
    magnitude2 += (tfidf2[ngram] || 0) ** 2;
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 && magnitude2) {
    return dotProduct / (magnitude1 * magnitude2);
  } else {
    return 0;
  }
}

function searchDocuments(documents, idf, query, n = 3) {
  const documentContents = documents.map(
      (doc) => doc.filePath + " " + doc.lang + " " + doc.code
  );

  // Normalize the query
  const normalizedQuery = query.toLowerCase().trim();
  const queryTFIDF = calculateTFIDF(normalizedQuery, idf, n);

  // Tokenize the query
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);

  // Calculate TF-IDF for each document
  const scores = documents.map((doc, index) => {
      const docTFIDF = calculateTFIDF(documentContents[index], idf, n);
      const score = cosineSimilarity(queryTFIDF, docTFIDF);

      // Initialize boost
      let boost = 0;

      // Check for presence of query tokens in code and headerTree
      const docContent = (doc.code + " " + doc.headerTree).toLowerCase();
      
      queryTokens.forEach(token => {
          if (docContent.includes(token)) {
              boost += 1; // Adjust boost value as needed
          }
      });

      // Combine score with boost
      const finalScore = score + boost;

      // console.log(`Document: ${doc.filePath}, Score: ${score}, Boost: ${boost}, Final Score: ${finalScore}`);

      return {
          document: doc,
          score: finalScore,
      };
  });

  // Sort by final score
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