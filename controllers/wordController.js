const Word = require("../models/Word");
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')

const getWord = asyncHandler( async(req,res) => {
    const { id } = req.params

    if(!id){
        return res.status(400).json({ message: 'word ID required '})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'ID sent is incorrect '})

    const word = await Word.findById(id).exec()

    if(!word){
        return res.status(400).json({ message: 'Word not found '})
    }

    return res.status(200).json(word)

})

const getAllWords = asyncHandler( async(req, res) => {
    const words = await Word.find().lean()

    if(!words?.length){
        return res.status(400).json({ message: 'No words found' })
    }

    return res.status(200).json(words)
})

const createWord = asyncHandler( async(req,res) => {
    console.log(req.body)
    const { language, word, difficulty } = req.body

    if(!language || !word || !difficulty){
        return res.status(400).json({ message: 'All fields are required '})
    }

    const duplicate = await Word.findOne({ word }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if(duplicate){
        return res.status(409).json({ message: 'This word already exists in the database '})
    }

    const wordObject = { language, word, difficulty }

    const createdWord = await Word.create(wordObject)

    if(createdWord){
        return res.status(201).json({ message: 'New word has been added to the db' })
    }
    else{
        return res.status(400).json({ message: 'Invalid data recieved' })   
    }
})

const updateWord = asyncHandler( async(req, res) => {
    const { id } = req.params

    if(!id){
        return res.status(400).json({ message: 'ID is not specified'})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'ID sent is incorrect '})

    const { language, word, difficulty } = req.body

    if(!language && !word && !difficulty){
        return res.status(400).json({ message: 'Atleast one field needs to be updated'})
    }

    const wordToBeUpdated = await Word.findById(id).exec()

    const duplicate = await Word.findOne({ word }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if(duplicate){
        return res.status(409).json({ message: 'This word already exists in the database '})
    }

    if(word)
        wordToBeUpdated.word = word
    if(language)
        wordToBeUpdated.language = language
    if(difficulty)
        wordToBeUpdated.difficulty = difficulty

    const updatedWord = await wordToBeUpdated.save()

    res.json({ message: `The word '${wordToBeUpdated.word}' with ID '${wordToBeUpdated._id}' has been updated`})
})

const deleteWord = asyncHandler( async(req,res) => {
    const { id } = req.params

    if(!id){
        return res.status(400).json({ message: 'word ID required '})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'ID sent is incorrect '})


    const word = await Word.findById(id).exec()

    if(!word){
        return res.status(400).json({ message: 'Word not found '})
    }

    const result = await word.deleteOne()

    const reply = `The word ${result.word} and with ID: ${result._id} has been deleted`

    res.json({successMessage : reply })
})

module.exports = {
    getWord,
    getAllWords,
    createWord,
    updateWord,
    deleteWord
}