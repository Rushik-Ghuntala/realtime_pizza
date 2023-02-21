const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3333

const mongoose = require('mongoose')


//Database connection
const url = 'mongodb://127.0.0.1:27017/pizza'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => console.log('Database connected...'))
    .catch(err => console.log(err))


//Assets
app.use(express.static('public'))

//set Templete engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

app.listen(3333, () => {
    console.log('Listening on Port 3333 ...')    
}) 