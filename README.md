# EcoAudit AI

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Flask-3-green" alt="Flask 3" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5-purple" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Docker-✓-blue" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License: MIT" />
</div>

---

## Overview

EcoAudit AI is a platform that helps small businesses create and implement sustainable practices through AI-powered analysis.

### Core Features

- **Sustainability Assessment**: Business-specific analysis based on industry, location, and offerings
- **Practical Recommendations**: Actionable sustainability improvements tailored for small businesses
- **Regional Context**: Considers local regulations, resources, and cultural practices
- **User-Friendly Interface**: Simple form-based input with clear, visual results

## Architecture

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│            │      │            │      │            │
│  React     │<────>│  Flask     │<────>│  AI        │
│  Frontend  │      │  Backend   │      │  Services  │
│            │      │            │      │            │
└────────────┘      └────────────┘      └────────────┘
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Qloo and Gemini API keys

### Docker Setup
```bash
# Clone repository
git clone https://github.com/yourusername/eco-audit-ai.git
cd qloo-hackathon-app

# Create .env file with API keys
# GEMINI_API_KEY=your_key
# QLOO_API_KEY=your_key
# VITE_API_URL=http://backend:5000

# Start services
docker-compose up -d

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## API Endpoints

### Create Audit
```
POST /audit/list
```
Business details → Sustainability audit with score, strengths, improvements and actionable tip

### List Audits
```
GET /audit/list
```
Returns all generated audits, sortable by various parameters

See [Backend README](backend/README.md) for complete API documentation.

## Project Structure

```
eco-audit-ai/
├── backend/             # Flask REST API
│   ├── app.py           # API endpoints
│   └── utils/           # Business logic
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   └── services/    # API client
└── docker-compose.yml   # Container orchestration
```

## Development

See [Backend README](backend/README.md) and [Frontend README](frontend/README.md) for detailed setup instructions.

## License

MIT
