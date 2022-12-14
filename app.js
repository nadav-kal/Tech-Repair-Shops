const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const techrepairsRoutes = require('./routes/techrepairs');
const reviewsRoutes = require('./routes/reviews');
const MongoDBStore = require('connect-mongo');

let db_Url = process.env.DB_URL;
if(process.env.NODE_ENV !== 'production') {
    db_Url = 'mongodb://localhost:27017/tech-repair';
}

mongoose.connect(db_Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // encoded req.body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoDBStore.create({
    mongoUrl: db_Url,
    secret,
    touchAfter: 24 * 60 * 60,
});

store.on('error', function (e) {
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if(!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/techrepairs', techrepairsRoutes);
app.use('/techrepairs/:id/reviews', reviewsRoutes);


app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new ExpressError("PAGE NOT FOUND!", 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong';
    console.log(err.message);
    res.status(statusCode).render('error', {err});
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})