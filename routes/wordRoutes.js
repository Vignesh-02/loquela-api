const express = require("express");
const router = express.Router();

const wordController = require("../controllers/wordController");

router
    .route("/")
    .get(wordController.getAllWords)
    .post(wordController.createWord);

router
    .route("/:id")
    .get(wordController.getWord)
    .delete(wordController.deleteWord)
    .patch(wordController.updateWord);

// router.route('/:language')
//     .get(wordController.getLanguageWords)

module.exports = router;
