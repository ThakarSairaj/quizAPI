const express = require('express');
const quizController = require('../controller/quiz.controller');
const { validateQuestionMiddleware } = require('../valid/validate');


const router = express.Router();

router.post('/quizzes', quizController.createQuiz);
router.post('/quizzes/:id/questions', validateQuestionMiddleware, quizController.addQuestion);
router.get('/quizzes/:id', quizController.getQuizQuestion);
router.post('/quizzes/:id/submit', quizController.submitAnswers);

module.exports = router;
