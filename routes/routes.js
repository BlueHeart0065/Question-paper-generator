const express = require('express');
const mysql = require('mysql');


const router = express.Router();


const db = mysql.createConnection({
    host: 'localhost',
    password: '',
    user: 'root',
    database: 'question-paper-database'
});

db.connect(err => {
    if(err){
        console.log('database connection error'.rainbow, err);
    }
    else{
        console.log('database connected '.rainbow);

    }
});



router.get('/' , (req , res) => {
    res.render('home');
});



module.exports = router;