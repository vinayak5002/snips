import { apiClient } from "./client";

async function searchSnips(query: string) {
  try {
    const response = await apiClient.get("/search-snips", {
      params: {
        query: query,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getSavedSnips() {
  try {
    const response = await apiClient.get("/saved-snips");
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function reindexDocuments() {
  try {
    const response = await apiClient.get("/re-index");
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getSavedRepos() {
  try {
    const response = await apiClient.get("/saved-repos");
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getCurrentRepo() {
  try {
    const response = await apiClient.get("/current-repo");
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function setCurrentRepo(newRepoPath: string) {
  try {
    const response = await apiClient.post("/current-repo", {
      newRepoPath,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default {
  searchSnips,
  getSavedSnips,
  reindexDocuments,
  getSavedRepos,
  setCurrentRepo,
  getCurrentRepo,
};
