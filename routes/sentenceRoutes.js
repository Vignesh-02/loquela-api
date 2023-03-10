const express = require("express");
const router = express.Router();

const sentenceController = require("../controllers/sentenceController");

router
    .route("/")
    .get(sentenceController.getAllSentences)
    .post(sentenceController.createSentence);

router
    .route("/:id")
    .get(sentenceController.getSentence)
    .delete(sentenceController.deleteSentence)
    .patch(sentenceController.updateSentence);

module.exports = router;
