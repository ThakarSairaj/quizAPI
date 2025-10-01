# Online Quiz API

A RESTful API for creating and taking quizzes, built with Node.js, Express, and SQLite. This project is a submission for the Associate Software Engineer (ASE) Challenge.

## Table of Contents

- [About The Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Running Locally](#installation--running-locally)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Design Choices](#design-choices)

## About The Project

This project is a backend API that provides all the necessary functionality for a quiz application. It allows for the creation of quizzes, the addition of questions with multiple-choice options, and a system for users to take quizzes and receive a score.

The primary goal is to demonstrate a solid understanding of backend fundamentals, including RESTful API design, data modeling, and clean code architecture.

## Tech Stack

- **Language:** JavaScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite
- **Database Library:** `sqlite3`

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You must have the following software installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Running Locally

1.  **Clone the repository:**
    ```
    git clone [Your Repository URL]
    ```
2.  **Navigate into the project directory:**
    ```

    cd quiz-api
    ```
3.  **Install the required dependencies:**
    ```
    npm install
    ```
4.  **Start the server:**
    ```
    npm start
    ```
    The server will start on `http://localhost:3000`. You can see a health check message at `http://localhost:3000/health`.

## API Endpoints

The following are the available endpoints for the API.

| Method | Route                       | Description                                      | Request Body (JSON)                                                                  | Success Response (201)                                              |
| :----- | :-------------------------- | :----------------------------------------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| `POST` | `/api/quizzes`              | Creates a new quiz.                              | `{ "title": "My First Quiz" }`                                                       | `{ "message": "Quiz created...", "data": { "id": 1, "title": "..." } }` |
| `POST` | `/api/quizzes/:id/questions` | Adds a new question with options to a specific quiz. | `{ "text": "What is 2+2?", "options": [{ "text": "3" }, { "text": "4", "is_correct": true }] }` | `{ "message": "Question added...", "data": { "id": 1, "text": "..." } }` |
| `GET`  | `/api/quizzes/:id`          | Fetches all questions for a specific quiz to start playing. **Correct answers are not included.** | (None)                                                                               | `{ "data": [{ "id": 1, "text": "...", "options": [...] }] }`         |
| `POST` | `/api/quizzes/:id/submit`   | Submits user's answers and returns the score.    | `{ "answers": [{ "question_id": 1, "option_id": 2 }, { "question_id": 2, "option_id": 5 }] }` | `{ "score": 1, "total": 2 }`                                        |

## Running Tests

To run the automated tests for this system, use the following command:

