const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const boardRoutes = require('./routes/boardRoutes');
const userRoutes = require('./routes/userRoutes');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const app = express();

let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
const mongUri = 'mongodb+srv://admin:admin123@cluster0.y383u.mongodb.net/project4?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongUri)
.then(()=>{
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

app.use(
    session({
        secret: 'fal39emdsakj49w1nmd1nm0ffnw',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: mongUri, collectionName: 'sessions'}),
        cookie: { maxAge: 60*60*1000},
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res)=>{
    res.render('./board/index');
});

app.use('/boards', boardRoutes(upload));

app.use('/users', userRoutes);

app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('./board/error', {error: err});
});

