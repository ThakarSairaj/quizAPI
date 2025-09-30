const quizService = require('../services/quiz.services');


const createQuiz = async (req, res) =>{
    try{
        const {title} = req.body;

        if(!title || title.trim() === '')
        {
            return res.status(400).json({
                success: false,
                message: 'Quiz title require'
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
            message: error.message
        });
    }
};

const addQuestion = async (req, res) =>{
  try{
    const quizId = req.params.id;
    const {text, question_type = 'mcq', options, correct_answer} = req.body;

    if(!text || text.trim() === '')
    {
      return res.status(400).json({
        success: false,
        message: "Question Text is required"
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
      message: "Question addedd successfully"
    });
  }
  catch(error){
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const getQuizQuestion = async (req, res) =>{
    try{
        const quizId = req.params.id;
        const quizData = await quizService.getQuizQuestion(quizId);

        res.status(200).json({
            success: true,
            message: "Quiz questions reterived successfully",
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

module.exports = {
    createQuiz,
    addQuestion,
    getQuizQuestion,
};