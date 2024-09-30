//require modules
const express = require('express');
const morgan = require('morgan');
// const methodOverride = require('method-override');
// const storyRoutes = require('./routes/storyRoutes');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

//mount middleware
app.use(express.static('public')); //where to locate static files
app.use(express.urlencoded({extended: true})); //parses data
app.use(morgan('tiny')); //logs req and res in the terminal
app.use(methodOverride('_method'));