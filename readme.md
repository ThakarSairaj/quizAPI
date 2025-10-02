# quizAPI — Online Quiz Application API

A RESTful backend API for creating and taking quizzes, built with **Node.js**, **Express**, and **SQLite**.  
This is my submission for the **Associate Software Engineer (ASE) Challenge**.

---

## Overview & Motivation

This project provides the backend logic for a quiz system — create quizzes, add questions, take quizzes, and calculate scores.  
It demonstrates RESTful API design, clean architecture, and testing practices.

---

## Tech Stack

- **Language:** JavaScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite
- **DB Library:** sqlite3
- **Testing:** Jest + Supertest

---

## Project Structure

```
quiz-api/
├── src/
│   ├── config/
│   │     └── database.js        
│   ├── controllers/
│   │     └── quiz.controller.js 
│   ├── routes/
│   │     └── quiz.routes.js     
│   ├── services/
│   │     └── quiz.service.js    
│   └── app.js                   
├── test/
│   └── quiz.routes.test.js  
├── .gitignore
├── index.js                     
├── package-lock.json
├── package.json
└── readme.md
```

---

##  Getting Started

### Prerequisites
- Node.js (v18.x or later recommended)
- npm (comes with Node.js)

### Installation & Running Locally

```bash
# Clone the repo
git clone https://github.com/ThakarSairaj/quizAPI.git
cd quizAPI

# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run devStart

# Or start normally
npm start
```

---

## API Endpoints

### Quiz Management

| Method | Route | Description | Example Body | Example Response |
|--------|-------|-------------|--------------|------------------|
| **POST** | `/api/quizzes` | Create a new quiz | `{ "title": "My First Quiz" }` | `{ "message": "Quiz created", "data": { "id": 1, "title": "My First Quiz" } }` |
| **POST** | `/api/quizzes/:id/questions` | Add a question with options | `{ "text": "What is 2+2?", "options": [{ "text": "3" }, { "text": "4", "is_correct": true }] }` | `{ "message": "Question added", "data": { "id": 1, "text": "What is 2+2?" } }` |

### Quiz Taking

| Method | Route | Description | Example Body | Example Response |
|--------|-------|-------------|--------------|------------------|
| **GET** | `/api/quizzes/:id` | Fetch all questions for a quiz (without answers) | — | `{ "data": [{ "id": 1, "text": "What is 2+2?", "options": [...] }] }` |
| **POST** | `/api/quizzes/:id/submit` | Submit answers & get score | `{ "answers": [{ "question_id": 1, "option_id": 2 }] }` | `{ "score": 1, "total": 1 }` |

---

## Running Tests

```bash
npm test
```

Tests cover core API endpoints (routes, validation, scoring).

---

## What’s Done & What’s Next

### Completed
- Core endpoints (create quiz, add questions, fetch quiz, submit answers).
- SQLite-based persistence.
- Basic automated test cases.

### Planned / Bonus Features
- Add validation for question types (MCQ, text with 300-char limit, etc.).
- Endpoint to retrieve a list of all available quizzes.
- More detailed unit tests for scoring logic.
- Better error handling & validation middleware.

---

## Design Choices

- **Separation of concerns:** routes → controllers → services → database.  
- **Scoring logic:** compares submitted answers against DB and returns `{ score, total }`.  
- **SQLite:** lightweight DB choice, perfect for a self-contained challenge project.  

---