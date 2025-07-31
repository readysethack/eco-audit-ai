# EcoAudit AI

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Flask-3-green" alt="Flask 3" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5-purple" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Docker-✓-blue" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License: MIT" />
</div>

<p align="center">
  <b>An AI-powered sustainability audit platform for businesses</b>
</p>

---

## 🌟 Overview

EcoAudit AI is a comprehensive full-stack application that helps businesses assess and improve their sustainability practices. By combining Qloo's cultural insights API with Google's Gemini AI, the platform delivers tailored sustainability audits with actionable recommendations.

### Key Capabilities

- 🔍 **Contextual Analysis**: Evaluates businesses based on type, location, and offerings
- 📊 **Sustainability Scoring**: Provides objective metrics for sustainability performance
- 💡 **AI-Powered Insights**: Identifies strengths and improvement opportunities
- 🎯 **Actionable Recommendations**: Delivers specific, practical sustainability tips
- 📱 **Modern Interface**: Offers an intuitive, responsive user experience

<p align="center">
  <img src="https://i.imgur.com/placeholder-screenshot.png" alt="EcoAudit AI Screenshot" width="600" />
</p>

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose (recommended for easy setup)
- Alternatively:
  - Python 3.9+ with Poetry for backend
  - Node.js 16+ with npm/yarn for frontend
- API Keys:
  - Qloo API key
  - Gemini API key

### Quick Start with Docker

The fastest way to get EcoAudit AI running:

1. **Clone the repository**
   ```bash
   git clone https://github.com/readysethack/eco-audit-ai.git
   cd qloo-hackathon-app
   ```

2. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   FLASK_ENV=development
   GEMINI_API_KEY=your_gemini_api_key
   QLOO_API_KEY=your_qloo_api_key
   VITE_API_URL=http://backend:5000
   ```

3. **Build and start the containers**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - API Documentation: [http://localhost:5000/docs](http://localhost:5000/docs)

### Manual Setup

#### Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   poetry install
   ```

3. **Configure environment**
   Create a `.env` file in the `backend/` directory:
   ```
   QLOO_API_KEY=your_qloo_api_key
   GEMINI_API_KEY=your_gemini_api_key
   FLASK_ENV=development
   ```

4. **Run the server**
   ```bash
   poetry run flask run --reload
   ```

   The API will be available at [http://localhost:5000](http://localhost:5000)

#### Frontend

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   Create a `.env.local` file in the `frontend/` directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at [http://localhost:5173](http://localhost:5173)

## 🏗️ Project Architecture

EcoAudit AI follows a modern client-server architecture:

### Backend (Flask)

- RESTful API built with Flask and Flask-SMOREST
- Integration with Qloo API for cultural insights
- Integration with Gemini AI for analysis and report generation
- Data validation with Marshmallow schemas
- Robust error handling with fallback responses

### Frontend (React)

- Modern React with TypeScript for type safety
- Vite for fast development and optimized builds
- Component-based architecture with proper separation of concerns
- Custom hooks for business logic
- Axios for API communication
- shadcn/ui components for clean, accessible UI

## 📂 Project Structure

```
eco-audit-ai/
├── docker-compose.yml      # Docker Compose configuration
├── README.md               # This file
├── test_data_search.txt    # Test data for search functionality
│
├── backend/                # Flask API for sustainability audits
│   ├── app.py              # Main API endpoints and routes
│   ├── Dockerfile          # Backend container configuration
│   ├── pyproject.toml      # Poetry dependency management
│   ├── requirements.txt    # Python dependencies
│   ├── README.md           # Backend-specific documentation
│   └── utils/              # Utility functions for API integration
│       ├── utils.py        # Core business logic
│       └── test_data.txt   # Test data for development
│
└── frontend/               # React frontend application
    ├── components.json     # UI component configuration
    ├── Dockerfile          # Frontend container configuration
    ├── nginx.conf          # Nginx configuration for production
    ├── package.json        # Node.js dependencies
    ├── README.md           # Frontend-specific documentation
    ├── src/                # Source code
    │   ├── components/     # React components
    │   │   ├── eco-audit/  # Business domain components
    │   │   └── ui/         # Reusable UI components
    │   ├── hooks/          # Custom React hooks
    │   ├── lib/            # Utility functions
    │   ├── services/       # API service layer
    │   ├── types/          # TypeScript type definitions
    │   └── App.tsx         # Main application component
    └── vite.config.ts      # Vite configuration
```

## 🌐 API Documentation

### Key Endpoints

#### Create a Sustainability Audit

```
POST /audit/list
```

**Request Body:**
```json
{
  "business_type": "independent vegan café",
  "location": "brussels",
  "products": ["oat milk", "handmade ceramics", "locally roasted beans"]
}
```

**Response (201 Created):**
```json
{
  "id": "bcaec2b4-1af7-468c-b475-5c437ccde903",
  "created": "2025-07-31T21:04:44.000000Z",
  "business_name": "The Independent Vegan Café, Brussels",
  "sustainability_score": 86,
  "strengths": [
    "Core vegan and plant-based offerings inherently reduce environmental footprint...",
    "Strong commitment to local sourcing...",
    "Promotion of reusability through handmade ceramics..."
  ],
  "improvements": [
    "Implement a comprehensive waste management program...",
    "Conduct an energy audit to identify opportunities..."
  ],
  "tip": "To further enhance your local appeal and sustainability..."
}
```

#### List Sustainability Audits

```
GET /audit/list?order_by=sustainability_score&order=desc
```

See [Backend README](backend/README.md) for complete API documentation.

## ✨ Application Features

### 1. Multi-Step Audit Form

The user journey begins with a step-by-step form collecting:
- Business name
- Business type
- Location information
- Products and offerings

### 2. AI-Powered Analysis

Behind the scenes, the application:
- Queries Qloo API for cultural and regional insights
- Identifies relevant sustainability practices
- Uses Gemini AI to generate context-aware recommendations

### 3. Comprehensive Audit Report

Each audit provides:
- Overall sustainability score (0-100)
- Three key strengths with detailed explanations
- Two priority improvement areas
- One specific, actionable sustainability tip

### 4. Audit History

Users can:
- Access previously generated audits
- Sort audits by name, date, or score
- Compare different businesses or track improvements

## 🤝 Contributing

We welcome contributions to improve EcoAudit AI!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Qloo](https://qloo.com/) for providing the cultural insights API
- [Google Gemini AI](https://gemini.google.com/) for powering the sustainability analysis
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Flask-SMOREST](https://flask-smorest.readthedocs.io/) for API framework
