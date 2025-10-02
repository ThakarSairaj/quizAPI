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


/*  */

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


const getQuizQuestion = async (quizId) => {
  try{

    const quiz = await dbGet(
      'SELECT * FROM quiz where id = ?',
      [quizId]
    );


    if(!quiz)
    {
      throw new Error("Quiz not found");
    }


    const questions = await dbAll(
      'SELECT id, quiz_id, text, question_type FROM questions wHERE quiz_id =  ?',
      [quizId]
    );


    for(const question of questions)
    {
      if(question.question_type === 'mcq')
      {
        const options = await dbAll(
          'SELECT id, question_id, text FROM options WHERE question_id = ?',
          [question.id]
        );
        question.options = options;
      }
    }


    return{
      quiz: quiz,
      questions: questions
    };

  }
  
  catch(error){
    throw new Error(`Error getting quiz questions: ${error.message}`);
  }
};



const submitAnswers = async (quizId, answers) => {
  try {

    const quiz = await dbGet(
      'SELECT * FROM quiz WHERE id = ?',
      [quizId]
    );


    if (!quiz) {
      throw new Error('Quiz not found');
    }


    let score = 0;
    const totalQuestions = answers.length;
    const userResult = [];


    for (const answer of answers) {
      const { question_id, question_type, selected_option_id, text_answer } = answer;

      const question = await dbGet(
        'SELECT * FROM questions WHERE id = ? AND quiz_id = ?',
        [question_id, quizId]
      );


      if (!question) {
        userResult.push({
          question_id,
          correct: false,
          error: 'Question not found'
        });
        continue;
      }


      let isCorrect = false;

      
      if (question_type === 'mcq') {
        const selectedOption = await dbGet(
          'SELECT * FROM options WHERE id = ? AND question_id = ?',
          [selected_option_id, question_id]
        );

        
        if (selectedOption && selectedOption.is_correct === 1) {
          isCorrect = true;
        }
      } 
      
      else if (question_type === 'text') {
        if (
          text_answer &&
          question.correct_answer &&
          text_answer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim()
        ) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        score++;
      }

      userResult.push({
        question_id,
        correct: isCorrect
      });
    }

    
    return {
      score,
      total: totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      userResult

    };
  } 
  
  catch (error) {
    throw new Error(`Error while submitting quiz: ${error.message}`);
  }
};


module.exports = {
createQuiz,
addQuestion,
getQuizQuestion,
submitAnswers,

};

