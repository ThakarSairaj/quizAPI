const express = require('express');
const app = express();
const quizRoutes = require('./routes/quiz.routes');


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', quizRoutes);

app.get('/status', (req, res) =>{
    res.json({
        message: 'Quiz API is running',
        version: '1.0.0'
    });
});

app.use((error, req, res, next) => {
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
});

module.exports = app;