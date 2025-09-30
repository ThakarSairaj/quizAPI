// const { ERROR } = require('sqlite3');
const db = require('../config/database');
const {promisify} = require('util');

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID }); // ✅ this is the fix
      }
    });
  });
};


const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

const createQuiz = async (title) => {
    try{
        const result = await dbRun(
            'INSERT INTO quiz(title) VALUES (?)',
            [title]
        );

        const quiz = await dbGet(
            'SELECT * FROM quiz WHERE id = ?',
            [result.lastID]
        
        );

        return quiz;

    }

    catch(error){
        throw new Error("Error While creating Quiz: " + error.message);
    }
};

module.exports = {
createQuiz,
};

