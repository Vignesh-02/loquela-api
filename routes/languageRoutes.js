const express = require("express");
const router = express.Router();

const languageController = require("../controllers/languageController");

router
    .route("/")
    .get(languageController.getAllLanguages)
    .post(languageController.createLanguage);

router
    .route("/:id")
    .get(languageController.getLanguage)
    .patch(languageController.updateLanguage)
    .delete(languageController.deleteLanguage);

router
    .route("/:id/words")
    .delete(languageController.deleteWordsFromLang)
    .get(languageController.getAllWordsForLanguage);

router
    .route("/:id/sentences")
    .delete(languageController.deleteSentencesFromLang)
    .get(languageController.getAllSentencesForLanguage);

module.exports = router;
