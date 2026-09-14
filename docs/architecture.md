# Sentinel AI 2.0 Architecture

## Request Flow

Login -> JWT Verification -> Role Verification -> Session Validation -> Rate Limiting -> ML Prompt Classification -> Risk Scoring -> Gemini Forwarding or Blocked Response

## Layers

- Frontend: React, Vite, Tailwind, Framer Motion, React Router, Axios
- Backend: Express, JWT, bcrypt, Multer, Mongoose
- ML: Python, scikit-learn, TF-IDF, Logistic Regression
- Storage: MongoDB and file uploads for PDFs and DOCX files

## Security Controls

- Zero Trust request gating
- Prompt injection detection
- Audit logging
- Role-based authorization
- Secure token handling