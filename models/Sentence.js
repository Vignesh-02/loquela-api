const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sentenceSchema = new Schema({
    
    language: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Language'
    },
    sentence: {
        type: String,
        required: true
    },
    difficulty:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Sentence', sentenceSchema)