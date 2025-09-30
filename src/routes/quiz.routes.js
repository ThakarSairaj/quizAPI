const express = require('express');
const quizController = require('../controller/quiz.controller');

const router = express.Router();

router.post('/create', quizController.createQuiz);
router.post('/:id/questions', quizController.addQuestion);

module.exports = router;
