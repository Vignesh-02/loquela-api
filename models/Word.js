const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wordSchema = new Schema({
    
    language: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Language'
    },
    word: {
        type: String,
        required: true
    },
    difficulty:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Words', wordSchema)