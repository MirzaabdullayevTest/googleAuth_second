const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const connectDB = require('./config/db')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const passport = require('passport')


// routes
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')

dotenv.config({ path: './config/config.env' })

const store = new MongoStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});


// Connecting with mongodb

// possport connect
require('./config/passport')(passport)

const app = express()

connectDB()
// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.urlencoded({ extended: true }))

// Handlebars
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ],
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(passport.initialize())
app.use(passport.session());

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', indexRouter)
app.use('/auth', authRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))