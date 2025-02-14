const express = require("express");
const snipsController = require("../controllers/snipsController");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true });
});
router.get("/current-repo", snipsController.getCurrentRepo);
router.post("/current-repo", snipsController.setCurrentRepo);
router.get("/saved-repos", snipsController.getSavedRepos);
router.get("/search-snips", snipsController.searchSnips);
router.get("/re-index", snipsController.reindexDocuments);
router.get("/check-repo-path", snipsController.checkRepoPath);
router.post("/add-repo", snipsController.addRepo);
router.get("/get-file", snipsController.getFile);
router.delete("/delete-repo", snipsController.removeRepo);
router.get("/history", snipsController.getHistory);
router.delete("/history", snipsController.clearHistory);
router.get("/check-for-updates", snipsController.checkForUpdates);

module.exports = router;
