const express = require('express');
const quizController = require('../controller/quiz.controller');

const router = express.Router();

router.post('/create', quizController.createQuiz);

module.exports = router;
