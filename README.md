# Sentinel AI 2.0 - Enterprise AI Assistant

Sentinel AI 2.0 is an enterprise AI platform where every AI request is inspected by a zero-trust security layer before it reaches the LLM.

## Features

- Zero Trust request flow
- JWT authentication and RBAC
- ML prompt jailbreak detection
- Prompt risk scoring and audit logging
- Gemini-backed AI gateway
- PDF and DOCX document intelligence
- Dark glassmorphism enterprise UI

## Project Structure

- `frontend/` React + Vite app
- `backend/` Express API and security services
- `ml/` Python training and prediction pipeline
- `database/` schema documentation
- `docs/` architecture documentation

## Local Setup

1. Install dependencies at the repository root.
2. Copy `backend/.env.example` to `backend/.env` and set your secrets.
3. Copy `frontend/.env.example` to `frontend/.env` if you want a custom API URL.
4. Start MongoDB if you want persistence, or run in demo mode with the built-in in-memory store.

## Demo Credentials

- Email: `admin@sentinel.local`
- Password: `Sentinel123!`

## Scripts

- `npm run dev` starts frontend and backend together.
- `npm run build` verifies the backend and builds the frontend.

## Security Notes

This repository is structured for production-style deployment. Set real secrets in environment variables before connecting it to a live identity provider or Gemini account.