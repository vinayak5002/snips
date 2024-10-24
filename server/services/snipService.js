const fs = require("fs");
const path = require("path");

const getUserObject = () => {
	const data = fs.readFileSync(path.join(__dirname, "../user.json"), "utf8");
	const user = JSON.parse(data);

	return user;
}

const saveUserObject = (user) => {
	fs.writeFileSync(
		path.join(__dirname, "../user.json"),
		JSON.stringify(user, null, 2)
	);
}

const getCurrentRepoIndex = () => {
	const user = getUserObject();

	return user.currentRepoIndex;
}

const getCurrentRepo = () => {
	const user = getUserObject();

	const returnObj = {
		path: user.repos[user.currentRepoIndex].path,
		lastIndexed: user.repos[user.currentRepoIndex].lastIndexed
	}

	console.log("return object: ", returnObj);
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

const updateRepoLastIndexedTime = (repoIndex) => {
	const user = getUserObject();

	user.repos[repoIndex].lastIndexed = new Date().toISOString();

	saveUserObject(user);

	return getCurrentRepo();
}

module.exports = {
	getCurrentRepo,
	getCurrentRepoIndex,
	addRepo,
	getSavedRepos,
	updateCurrentRepoIndex,
	updateRepoLastIndexedTime
};