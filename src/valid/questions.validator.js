const { z } = require('zod');

const optionSchema = z.object({
  text: z.string().min(1).max(300),
  is_correct: z.boolean().optional()
});

const questionSchemas = {
  mcq: z.object({
    text: z.string().min(1).max(300),
    question_type: z.literal('mcq').optional(),
    options: z.array(optionSchema).min(2),
  }).refine(
    data => data.options.filter(opt => opt.is_correct).length >= 1,
    { message: 'At least one option must be marked as correct' }
  ),

  text: z.object({
    text: z.string().min(1).max(300),
    question_type: z.literal('text').optional(),
    correct_answer: z.string().min(1).max(300)
  })
};

const validateQuestion = (data) => {
  const questionType = data.question_type || 'mcq';
  const schema = questionSchemas[questionType];
  
  if (!schema) {
    throw new Error(`Invalid question type: ${questionType}. Must be 'mcq' or 'text'`);
  }
  
  return schema.parse(data);
};

module.exports = { validateQuestion, questionSchemas };
