const Language = require('../models/Language')
const Word = require('../models/Word')
const Sentence = require('../models/Sentence')
const mongoose = require('mongoose')

const asyncHandler = require('express-async-handler')

const getLanguage = asyncHandler( async(req,res) => {
    const { id } = req.params

    if(!id){
        return res.status(400).json({ message: 'language ID required '})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'ID sent is incorrect '})

    const lang = await Language.findById(id).exec()

    if(!lang){
        return res.status(400).json({ message: 'language not found '})
    }

    return res.status(200).json(lang)

})


const getAllLanguages = asyncHandler( async (req,res) => {
    const languages = await Language.find().lean()

    if(!languages?.length){
        return res.status(400).json({ message: 'No languages found' })
    }

    return res.status(200).json(languages)
})

const getAllWordsForLanguage = asyncHandler( async(req, res) => {
    
    const { id } = req.params

    const wordsWithlang = await Word.find({ language: id }).exec()

    if(!wordsWithlang){
        return res.status(400).json({ message: 'Words not found '})
    }

    if(wordsWithlang.length === 0){
        return res.status(200).json({ message: 'Add words for this languagege. 0 words present '})
    }

    res.status(200).json(wordsWithlang)
})

const getAllSentencesForLanguage = asyncHandler( async(req, res) => {
    
    const { id } = req.params

    const sentencesWithlang = await Sentence.find({ language: id }).exec()

    if(!sentencesWithlang){
        return res.status(400).json({ message: 'Words not found '})
    }

    if(sentencesWithlang.length === 0){
        return res.status(200).json({ message: 'Add sentences for this languagege. 0 sentences present '})
    }

    res.status(200).json(sentencesWithlang)
})

const createLanguage = asyncHandler( async(req, res) => {
    
    const  { name }  = req.body

    if(!name){
        return res.status(400).json({ message: 'All fields are required '})

    }

    const duplicate = await Language.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if(duplicate){
        return res.status(409).json({ message: 'This language already exists in the database '})
    }

    const languageObject = { name }

    const addedLanguage = await Language.create(languageObject)

    if(addedLanguage){
        return res.status(201).json({ message: 'New language has been added to the db' })
    }
    else{
        return res.status(400).json({ message: 'Invalid data recieved' })   
    }
})

const updateLanguage = asyncHandler( async(req, res) => {
    const { id } = req.params

    if(!id){
        return res.status(400).json({ message: 'ID is not specified'})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'ID sent is incorrect '})

    const { name } = req.body

    if(!name){
        return res.status(400).json({ message: 'Name field is required'})
    }

    const LangToBeUpdated = await Language.findById(id).exec()

    const duplicate = await Language.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if(duplicate){
        return res.status(409).json({ message: 'This language already exists in the database '})
    }

    LangToBeUpdated.name = name

    const updatedLang = await LangToBeUpdated.save()

    res.json({ message: `The language ${updatedLang.name} has been updated`})
})

const deleteLanguage = asyncHandler( async(req,res) => {
    const { id } = req.params

    if(!id){
        return res.status(400).json({ message: 'lang ID required '})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'ID sent is incorrect '})


    const lang = await Language.findById(id).exec()

    if(!lang){
        return res.status(400).json({ message: 'Language not found '})
    }

    const wordsWithLang = await Word.find({ language: id }).exec()

    if(wordsWithLang){
        return res.status(400).json({ message: 'The current language has words inside them. Delete them first '})
    }

    const sentencesWithlang = await Sentence.find({ language: id }).exec()

    if(sentencesWithlang){
        return res.status(400).json({ message: 'The current language has sentences inside them. Delete them first '})
    }

    const result = await lang.deleteOne()

    const reply = `The language with ID ${result._id}  has been deleted`

    res.json({successMessage : reply })
})

const deleteWordsFromLang = asyncHandler( async(req,res) => {
    const { id } = req.params


    if(!id){
        return res.status(400).json({ message: 'lang ID required '})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'ID sent is incorrect '})


    const wordsWithlang = await Word.find({ language: id }).exec()

    if(!wordsWithlang){
        return res.status(400).json({ message: 'Words not found '})
    }

    const result = await wordsWithlang.map(item => item.delete())

    const reply = `The words with Language ID ${id} have been deleted`

    res.json({successMessage : reply })
})


const deleteSentencesFromLang = asyncHandler( async(req,res) => {
    const { id } = req.params


    if(!id){
        return res.status(400).json({ message: 'lang ID required '})
    }

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'ID sent is incorrect '})


    const sentencesWithlang = await Sentence.find({ language: id }).exec()

    if(!sentencesWithlang){
        return res.status(400).json({ message: 'Sentences not found '})
    }

    const result = await sentencesWithlang.map(item => item.delete())

    const reply = `The sentences with Language ID ${id} have been deleted`

    res.json({successMessage : reply })
})


module.exports = {
    getAllLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    deleteWordsFromLang,
    deleteSentencesFromLang,
    getLanguage,
    getAllWordsForLanguage,
    getAllSentencesForLanguage
}