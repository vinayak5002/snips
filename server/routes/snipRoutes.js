const express = require("express");
const snipsController = require("../controllers/snipsController");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true });
});
router.get("/current-repo", snipsController.getCurrentRepo);
router.post("/current-repo", snipsController.setCurrentRepo);
router.post("/saved-repos", snipsController.getSavedRepos);
router.get("/search-snips", snipsController.searchSnips);
router.get("/re-index", snipsController.reindexDocuments);

module.exports = router;
