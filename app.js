require('dotenv').config()
const express = require('express')
const app = express()
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const dbConnect = require('./config/dbConn')

const languageRoutes = require('./routes/languageRoutes')
const sentenceRoutes = require('./routes/sentenceRoutes')
const wordRoutes = require('./routes/wordRoutes')
dbConnect()

app.use(logger)

app.use(express.json())

app.use('/word', wordRoutes)
app.use('/sentence', sentenceRoutes)
app.use('/language', languageRoutes)

app.get('/henlo',(req,res) => {
    res.send({msg: 'henlo'})
})

app

app.listen(8000, () => {
    console.log(`The server is running on port 8000`)
})