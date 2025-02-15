const fs = require("fs");
const path = require("path");
const { dataFileName, historyFileName } = require("../constants/constants");
const { deleteIndexedFiles } = require("../utils/utils");
const { error, timeStamp, clear } = require("console");

const getUserObject = () => {
	const data = fs.readFileSync(path.join(__dirname, "..", dataFileName), "utf8");
	const user = JSON.parse(data);

	return user;
}

const getHistoryObject = () => {
	const data = fs.readFileSync(path.join(__dirname, "..", historyFileName), "utf8");
	const history = JSON.parse(data);

	return history;
}

const saveUserObject = (user) => {
	fs.writeFileSync(
		path.join(__dirname, "..", dataFileName),
		JSON.stringify(user, null, 2)
	);
}

const saveHistoryObject = (history) => {
	fs.writeFileSync(
		path.join(__dirname, "..", historyFileName),
		JSON.stringify(history, null, 2)
	);
}

const getCurrentRepoIndex = () => {
	const user = getUserObject();

	return user.currentRepoIndex;
}

const getRepoIndex = (repoPath) => {
	const user = getUserObject();

	const repoIndex = user.repos.findIndex((repo) => repo.path === repoPath);

	return repoIndex;
}

const getCurrentRepo = () => {
	const user = getUserObject();

	const returnObj = user.repos[user.currentRepoIndex];

	return returnObj
}

const addRepo = (repoPath) => {
	const user = getUserObject();

	const repoEntry = {
		path: repoPath,
		lastIndexed: null
	}

	user.repos.push(repoEntry);

	saveUserObject(user);

	return repoEntry;
}

const getSavedRepos = () => {
	const user = getUserObject();

	return user.repos;
}

const updateCurrentRepoIndex = (newRepoPath) => {
	const user = getUserObject();

	const savedRepos = getSavedRepos();

	const newRepoIndex = savedRepos.findIndex((repo) => repo.path === newRepoPath);

	console.log("Updating current repo index: ", newRepoIndex);

	user.currentRepoIndex = newRepoIndex;

	saveUserObject(user);

	return getCurrentRepo();
}

const updateRepoLastIndexedTime = async (repoIndex) => {
	console.log("Updating last indexed time for repo: ", repoIndex);
	const user = getUserObject();

	user.repos[repoIndex].lastIndexed = new Date().toISOString();

	saveUserObject(user);

	return getCurrentRepo();
}

const removeRepo = (repoPath) => {
	const user = getUserObject();

	const repoIndex = getRepoIndex(repoPath);

	if(repoIndex === -1) {
		throw new Error("Repo not found");
	}

	if(user.currentRepoIndex === repoIndex) {
		throw new Error("Cannot delete current repo");
	}

	deleteIndexedFiles(repoPath);

	const deleteRepo = user.repos[repoIndex];

	user.repos.splice(repoIndex, 1);

	saveUserObject(user);

	return deleteRepo;
}

const addHistoryRecord = (query) => {
	const history = getHistoryObject();
	
	const historyRecord = {
		query: query,
		timeStamp: new Date().toISOString(),
	}

	history.history.push(historyRecord);

	saveHistoryObject(history);
}

const getHistory = () => {
	const history = getHistoryObject();

	return history.history;
}

const clearHistory = () => {
	const history = getHistoryObject();

	history.history = [];
	saveHistoryObject(history);
}

module.exports = {
	getCurrentRepo,
	getCurrentRepoIndex,
	addRepo,
	getSavedRepos,
	updateCurrentRepoIndex,
	updateRepoLastIndexedTime,
	removeRepo,
	addHistoryRecord,
	getHistory,
	clearHistory
};