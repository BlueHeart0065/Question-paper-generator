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

router.get('/exam/:id' , (req , res) => {
    const id = req.params.id;
    db.query('SELECT * FROM paper WHERE paper_id = ?' , [id] , (err , results) => {
        if(err){
            console.log('error in fetching paper name of id'.rainbow,id.rainbow , err);
        }
        else{
            const paperName = results[0].paper_name;

            db.query(`SELECT * FROM ${mysql.escapeId(paperName)}`, (error , reslt) => {
                if(error){
                    console.log('error in fetching the paper and its questions table' , error);
                }
                else{
                    // console.log('REACHED'.cyan);
                    res.render('exam' , {questions : reslt});
                }
            })
        }
    })

});



module.exports = router;