const express = require('express');
const mysql = require('mysql');
const session = require('express-session');



const router = express.Router();

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));


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
            // const questions = results[0].question_count;
            req.session.questionCount = questionCount;
            req.session.paperName = paperName;
            console.log('paper inserted'.rainbow);
            db.query(`CREATE TABLE ${mysql.escapeId(paperName)} (question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, question_text BLOB NOT NULL ,option_1 BLOB NOT NULL , option_2 BLOB NOT NULL , option_3 BLOB NOT NULL , option_4 BLOB NOT NULL , answer INT NOT NULL)` , (error , reslt) => {
                if(error){
                    console.log('error in creating table'.rainbow , err)
                }
                else{
                    console.log('table created'.rainbow);
                    res.redirect('/create/add');
                    // res.render('add-question' , {questionCount});
                }
            });
        }
    });

})

router.get('/create/add' , (req , res) => {
    const questionCount = req.session.questionCount;
    res.render('add-question' , {questionCount});
});

router.post('/create/add' , (req , res) => {

    const {questionInput , option1 , option2 , option3 , option4 , answer} = req.body;

    const count = req.session.questionCount;
    const paperName = req.session.paperName;

    for(let i = 0 ; i < count ; i++){
        db.query(`INSERT INTO ${mysql.escapeId(paperName)} (question_text , option_1 , option_2 , option_3 , option_4 , answer) VALUES (? , ? , ? , ? , ? , ? )` , [questionInput[i] , option1[i] , option2[i] , option3[i] , option4[i] , answer[i]] , (err , results) => {
            if(err){
                console.log('error in inserting questions'.rainbow , err);
            }
            else{
                console.log('inserted questions successfully'.rainbow);
            }
        });
    }

    res.redirect('/');

})



module.exports = router;