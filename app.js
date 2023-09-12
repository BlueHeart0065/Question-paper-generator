const express = require('express');
const ejs  = require('ejs');
const mysql = require('mysql');
const colors = require('colors');
const path = require('path');
const router = require('./routes/routes');

const app = express();
const port = 3000;

app.set('view engine' , 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/' , router);


app.listen(port , () => {
    console.log(`Website hosted on port ${port}`.rainbow);
});
