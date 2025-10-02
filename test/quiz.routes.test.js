const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('Quiz API Tests', () => {

  // Close database connection after all tests
  afterAll((done) => {
    db.close(done);
  });

  // ========================================
  // Test Suite 1: POST /api/quizzes (Create Quiz)
  // ========================================
  describe('POST /api/quizzes', () => {
    
    it('should create a new quiz with valid title', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .send({ title: 'Test Quiz' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Quiz');
    });

    it('should return 400 error for empty title', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .send({ title: '' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 error when title is missing', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Quiz title is required');
    });
  });

  // ========================================
  // Test Suite 2: POST /api/quizzes/:id/questions (Add Questions)
  // ========================================
  describe('POST /api/quizzes/:id/questions', () => {
    let quizId;

    // Create a quiz before each test in this suite
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .send({ title: 'Test Quiz for Questions' });
      quizId = response.body.data.id;
    });

    it('should add a question with valid data', async () => {
      const response = await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'What is 2 + 2?',
          question_type: 'mcq',
          options: [
            { text: '3', is_correct: false },
            { text: '4', is_correct: true },
            { text: '5', is_correct: false }
          ]
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.text).toBe('What is 2 + 2?');
      expect(response.body.data.options).toHaveLength(3);
    });

    it('should return 400 error for empty question text', async () => {
      const response = await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: '',
          options: [{ text: 'Answer', is_correct: true }]
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Question text is required');
    });

    it('should return 400 error when question text is missing', async () => {
      const response = await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          options: [{ text: 'Answer', is_correct: true }]
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Question text is required');
    });
  });

  // ========================================
  // Test Suite 3: GET /api/quizzes/:id (Get Quiz Questions)
  // ========================================
  describe('GET /api/quizzes/:id', () => {
    let quizId;

    // Create a quiz and add questions before tests
    beforeEach(async () => {
      // Create quiz
      const quizResponse = await request(app)
        .post('/api/quizzes')
        .send({ title: 'Math Quiz' });
      quizId = quizResponse.body.data.id;

      // Add question 1
      await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'What is 5 + 3?',
          question_type: 'mcq',
          options: [
            { text: '7', is_correct: false },
            { text: '8', is_correct: true },
            { text: '9', is_correct: false }
          ]
        });

      // Add question 2
      await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'What is 10 - 4?',
          question_type: 'mcq',
          options: [
            { text: '5', is_correct: false },
            { text: '6', is_correct: true },
            { text: '7', is_correct: false }
          ]
        });
    });

    it('should fetch all questions for a quiz', async () => {
      const response = await request(app)
        .get(`/api/quizzes/${quizId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.questions).toHaveLength(2);
      expect(response.body.data.quiz).toHaveProperty('id', quizId);
    });

    it('should not include is_correct in options', async () => {
      const response = await request(app)
        .get(`/api/quizzes/${quizId}`);

      const firstQuestion = response.body.data.questions[0];
      const firstOption = firstQuestion.options[0];
      
      // Verify is_correct is NOT in the response
      expect(firstOption).not.toHaveProperty('is_correct');
    });
  });

  // ========================================
  // Test Suite 4: POST /api/quizzes/:id/submit (Submit Answers)
  // ========================================
  describe('POST /api/quizzes/:id/submit', () => {
    let quizId;
    let question1Id, question2Id;
    let correctOption1Id, correctOption2Id;

    beforeEach(async () => {
      // Create quiz
      const quizResponse = await request(app)
        .post('/api/quizzes')
        .send({ title: 'Scoring Test Quiz' });
      quizId = quizResponse.body.data.id;

      // Add question 1
      const q1Response = await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'What is 2 + 2?',
          question_type: 'mcq',
          options: [
            { text: '3', is_correct: false },
            { text: '4', is_correct: true },
            { text: '5', is_correct: false }
          ]
        });
      question1Id = q1Response.body.data.id;
      correctOption1Id = q1Response.body.data.options.find(opt => opt.is_correct === 1).id;

      // Add question 2
      const q2Response = await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'What is 10 / 2?',
          question_type: 'mcq',
          options: [
            { text: '4', is_correct: false },
            { text: '5', is_correct: true },
            { text: '6', is_correct: false }
          ]
        });
      question2Id = q2Response.body.data.id;
      correctOption2Id = q2Response.body.data.options.find(opt => opt.is_correct === 1).id;
    });

    it('should calculate correct score for all correct answers', async () => {
      const response = await request(app)
        .post(`/api/quizzes/${quizId}/submit`)
        .send({
          answers: [
            { question_id: question1Id, question_type: 'mcq', selected_option_id: correctOption1Id },
            { question_id: question2Id, question_type: 'mcq', selected_option_id: correctOption2Id }
          ]
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.score).toBe(2);
      expect(response.body.data.total).toBe(2);
      expect(response.body.data.percentage).toBe(100);
    });

    it('should return 400 error for empty answers array', async () => {
      const response = await request(app)
        .post(`/api/quizzes/${quizId}/submit`)
        .send({ answers: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Answers Array is required and can't be empty");
    });

    it('should return 400 error when answers is missing', async () => {
      const response = await request(app)
        .post(`/api/quizzes/${quizId}/submit`)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Answers Array is required and can't be empty");
    });
  });

});
