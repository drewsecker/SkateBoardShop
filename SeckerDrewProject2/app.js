const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const boardRoutes = require('./routes/boardRoutes');
const multer = require('multer');
const path = require('path');

const app = express();

let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

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

app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});