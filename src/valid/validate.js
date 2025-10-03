const { validateQuestion } = require('./questions.validator');

const validateQuestionMiddleware = (req, res, next) => {
  try {
    req.body = validateQuestion(req.body);
    next();
  } catch (error) {
  if (error.name === 'ZodError' && error.errors) {
  return res.status(400).json({
    error: 'ValidationError',
    message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
  });
}

    return res.status(400).json({
      error: 'ValidationError',
      message: error.message
    });
  }
};

module.exports = { validateQuestionMiddleware };
