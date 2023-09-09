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

    db.query('SELECT * FROM paper' , (err , results) => {

        if(err){
            console.log('error in fetching papers'.rainbow , err);
        }
        else{
            res.render('home' , {papers : results});
        }
    })
});



module.exports = router;