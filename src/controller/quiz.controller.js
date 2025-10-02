const quizService = require('../services/quiz.services');

// Calls service to create a new quiz with the title
const createQuiz = async (req, res) =>{
    try{
        const {title} = req.body;

        if(!title || title.trim() === '')
        {
            return res.status(400).json({
                success: false,
                error: 'Quiz title is required'
            });
        }
        const quiz = await quizService.createQuiz(title.trim());

        res.status(201).json({
            success: true,
            data: quiz,
            message: "Quiz created successfully",
        });
    }
    catch(error) {
        res.status(500).json({
            success: false,
            error: "Failed to create quiz",
            details: error.message
        });
    }
};

// Calls service to adda question to a quiz
const addQuestion = async (req, res) =>{
  try{
    
    const quizId = req.params.id;
    const {text, question_type = 'mcq', options, correct_answer} = req.body;

    if(!text || text.trim() === '')
    {
      return res.status(400).json({
        success: false,
        error: "Question text is required"
      });
    }

    const question = await quizService.addQuestion(quizId, {
      text: text.trim(),
      question_type,
      options,
      correct_answer: correct_answer?.trim(),
    });

    res.status(201).json({
      success: true,
      data: question,
      message: "Question added successfully"
    });
  }

  catch(error){
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Calls service to get all questions of quiz
const getQuizQuestion = async (req, res) =>{
    try{

        const quizId = req.params.id;
        const quizData = await quizService.getQuizQuestion(quizId);

        res.status(200).json({
            success: true,
            message: "Quiz questions retrieved successfully",
            data: quizData
        });
    }
    catch(error)
    {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Calls service to submit quiz answer and get result
const submitAnswers = async (req, res) =>{
    try{

        const quizId = req.params.id;
        const {answers} = req.body;

        if(!answers || !Array.isArray(answers) || answers.length === 0)
        {
            return res.status(400).json({
                success: false,
                error: "Answers Array is required and can't be empty"
            });
        }

        const userResult = await quizService.submitAnswers(quizId, answers);

        res.status(200).json({
            success: true,
            message: "Quiz Submitted successfully",
            data: userResult
        });

    }
    
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createQuiz,
    addQuestion,
    getQuizQuestion,
    submitAnswers,
};