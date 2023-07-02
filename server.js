require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3333

const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')



//Database connection
const url = 'mongodb://127.0.0.1:27017/pizza'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => console.log('Database connected...'))
    .catch(err => console.log(err))

const connection = mongoose.connection;




//session store
// let mongoStore =  new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })


//Event emmiter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


//Session Config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({
        mongoUrl: url
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }  //24 hours
})) 

//passport config
const passportInit = require('./app/config/passport')
const { Server } = require('http')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())

//global middlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})




//set Templete engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

//404 Page
app.use((req, res) => {
    res.status(404).render('errors/404')
})

const server = app.listen(3333, () => {
    console.log('Listening on Port 3333 ...')    
}) 


// Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})