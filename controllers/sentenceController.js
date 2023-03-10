const Sentence = require("../models/Sentence");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const getSentence = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "sentence ID required " });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "ID sent is incorrect " });

    const sentence = await Sentence.findById(id).exec();

    if (!sentence) {
        return res.status(400).json({ message: "sentence not found " });
    }

    return res.status(200).json(sentence);
});

const getAllSentences = asyncHandler(async (req, res) => {
    const sentences = await Sentence.find().lean();

    if (!sentences?.length) {
        return res.status(400).json({ message: "No sentences found" });
    }

    return res.status(200).json(sentences);
});

const createSentence = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { language, sentence, difficulty } = req.body;

    if (!language || !sentence || !difficulty) {
        return res.status(400).json({ message: "All fields are required " });
    }

    const duplicate = await Sentence.findOne({ sentence })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();

    if (duplicate) {
        return res
            .status(409)
            .json({ message: "This sentence already exists in the database " });
    }

    const sentenceObject = { language, sentence, difficulty };

    const createdSentence = await Sentence.create(sentenceObject);

    if (createdSentence) {
        return res
            .status(201)
            .json({ message: "New sentence has been added to the db" });
    } else {
        return res.status(400).json({ message: "Invalid data recieved" });
    }
});

const updateSentence = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID is not specified" });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "ID sent is incorrect " });

    const { language, sentence, difficulty } = req.body;

    if (!language && !sentence && !difficulty) {
        return res
            .status(400)
            .json({ message: "Atleast one field needs to be updated" });
    }

    const sentenceToBeUpdated = await Sentence.findById(id).exec();

    const duplicate = await Sentence.findOne({ sentence })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();

    if (duplicate) {
        return res
            .status(409)
            .json({ message: "This sentence already exists in the database " });
    }

    if (sentence) sentenceToBeUpdated.sentence = sentence;
    if (language) sentenceToBeUpdated.language = language;
    if (difficulty) sentenceToBeUpdated.difficulty = difficulty;

    const updatedSentence = await sentenceToBeUpdated.save();

    res.json({
        message: `The sentence '${sentenceToBeUpdated.sentence}' with ID: '${sentenceToBeUpdated._id}' has been updated`,
    });
});

const deleteSentence = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "sentence ID required " });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "ID sent is incorrect " });

    const sentence = await Sentence.findById(id).exec();

    if (!sentence) {
        return res.status(400).json({ message: "sentence not found " });
    }

    const result = await sentence.deleteOne();

    const reply = `The sentence '${result.sentence}' and with ID: '${result._id}' has been deleted`;

    res.json({ successMessage: reply });
});

module.exports = {
    getSentence,
    getAllSentences,
    createSentence,
    updateSentence,
    deleteSentence,
};
