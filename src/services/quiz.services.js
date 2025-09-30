// const { ERROR } = require('sqlite3');
const db = require('../config/database');
const {promisify} = require('util');

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID });
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

const addQuestion = async (quizId, questionData) => {
  const {text, question_type = 'mcq', options, correct_answer} = questionData;

  try{
    const questionResult = await dbRun(
      'INSERT INTO questions(quiz_id, text, question_type, correct_answer) VALUES(?, ?, ?, ?)',
      [quizId, text, question_type, correct_answer || null]
    );
  const questionId = questionResult.lastID;

  if(question_type === 'mcq' && options && options.length > 0)
  {
    for(const option of options)
    {
      await dbRun(
        'INSERT INTO options (question_id, text, is_correct) VALUES(?, ?, ?)',
        [questionId, option.text, option.is_correct ?1 : 0]
      );
    }
  }
  return await getQuestionById(questionId);
}

  catch(error)
  {
    throw new Error("Error while adding question" + error.message);
  }
};

const getQuestionById = async(questionId) =>
{
  try{
    const question = await dbGet(
      'SELECT *  FROM questions where id = ?',
      [questionId]

    );
    if(!question)
    {
      throw new Error("Question Not Found");
    }

    if(question.question_type === 'mcq')
    {
      const options = await dbAll(
        'SELECT * FROM options WHERE question_id = ?',
        [questionId]
      );
      question.options = options;

    }
    return question;
  }
  catch(error)
  {
    throw new Error("Error getting questions:" + error.message);
  }
};

module.exports = {
createQuiz,
addQuestion,
};

