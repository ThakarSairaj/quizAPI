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



module.exports = {
    createQuiz,
};