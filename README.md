# EstateHub Full Stack Real Estate Portal

React + Vite frontend, Node + Express backend, MySQL database and JWT authentication.

## Setup
1. Install dependencies:
`npm install`
`npm run install-all`

2. Open MySQL Workbench and run `database/schema.sql`.

3. Copy `backend/.env.example` to `backend/.env` and set your MySQL password and JWT secret.

4. Start both frontend and backend:
`npm run dev`

Frontend: http://localhost:5173
API health: http://localhost:5000/api/health

Demo admin:
Email: admin@estatehub.com
Password: Admin@12345

Never upload backend/.env to GitHub.
