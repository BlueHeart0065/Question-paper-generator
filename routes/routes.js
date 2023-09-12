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

router.get('/create' , (req , res) => {
    res.render('create-exam')
})

router.post('/create' , (req , res) => {
    const {paperName  ,questionCount , difficulty , topics} = req.body;

    db.query('INSERT INTO paper (paper_name , question_count , difficulty , question_topics) VALUES (? ,? , ? , ?)', [paperName , questionCount , difficulty , topics] , (err , results) => {
        if(err){
            console.log('error in paper insertion'.rainbow , err);
            return
        }
        else{
            console.log('paper inserted'.rainbow);
            db.query(`CREATE TABLE ${mysql.escapeId(paperName)} (question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, question_text BLOB NOT NULL ,option_1 BLOB NOT NULL , option_2 BLOB NOT NULL , option_3 BLOB NOT NULL , option_4 BLOB NOT NULL , answer INT NOT NULL)` , (error , reslt) => {
                if(error){
                    console.log('error in creating table'.rainbow , err)
                }
                else{
                    console.log('table created'.rainbow);
                    res.render('add-question' , {questions : results});
                }
            });
        }
    });


})



module.exports = router;