const sqlite3 = require('sqlite3').verbose();
const path  = require('path');

// Creating database connection

const dbPath = path.join(__dirname, '../../quizdb.db');
const db = new sqlite3.Database(dbPath, error =>
{  
    if(error)
    {
        console.log("Can't connect to the database", error.message);
    }
    else
    {
        console.log("Connection successful");
    }

});


// Schemas for the database

const createTables = () =>
{
    const queries = [

        `CREATE TABLE IF NOT EXISTS quiz(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,

        `CREATE TABLE IF NOT EXISTS questions(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        quiz_id INTEGER NOT NULL, 
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(quiz_id) REFERENCES quiz(id) ON DELETE CASCADE)`,

        `CREATE TABLE IF NOT EXISTS options(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT 0,
        FOREIGN KEY (question_id) REFERENCES questions(id) on DELETE CASCADE)`

    ];


    queries.forEach((query, i) => {
        db.run(query, (error) =>
        {
            if(error)
            {
                console.error(`Error at table ${i+1} `+ error.message);
            }
            else
            {
                console.log(`Table ${i+1} created successfully`);
            }
        })
    });

};

// Adding column for the question type

const addMissingColumns = () =>{
    const alterQueries = [
        `ALTER TABLE questions ADD COLUMN question_type TEXT DEFAULT 'mcq'`,
        `ALTER TABLE questions ADD COLUMN correct_answer TEXT`

    ];

    alterQueries.forEach((query, i) =>{
        db.run(query, (error) =>{
            if(error){
                if(!error.message.includes('duplicate column'))
                {
                    console.error(`Error while adding column ${i + 1}: ${error.message}`);
                }
            }
            else{
                console.log(`Column ${i + 1} added successfully`);
            }
        });
    });

};

createTables();
addMissingColumns();
module.exports = db;
