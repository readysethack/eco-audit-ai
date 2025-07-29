# EcoAudit AI

EcoAudit AI is a full-stack application that generates sustainability audits for businesses using Qloo's cultural insights API and Gemini AI. The application provides actionable recommendations to improve sustainability practices.


## Overview

This project combines:

- **AI-powered sustainability analysis**: Leveraging Qloo's cultural data API and Gemini AI to generate customized sustainability audits
- **Modern web frontend**: Built with React, TypeScript, and Vite
- **Robust backend API**: Developed with Flask and Flask-SMOREST

The application analyzes businesses based on their type, location, and products to provide:
- Sustainability scores
- Key strengths in current practices
- Improvement recommendations
- Actionable tips specific to the business context

## Project Structure

```
eco-audit-ai/
├── backend/           # Flask API for sustainability audits
│   ├── app.py         # Main API endpoints
│   ├── utils/         # Utility functions for API integration
│   ├── README.md      # Backend documentation
│   └── pyproject.toml # Python dependencies
│
└── frontend/          # React frontend application
    ├── src/           # Source code
    │   ├── components/# React components
    │   ├── App.tsx    # Main application component
    │   └── ...        # Other source files
    ├── README.md      # Frontend documentation
    └── package.json   # Node.js dependencies
```

## Quick Start

### Prerequisites

- Python 3.13 or higher
- Node.js 16 or higher
- Poetry (Python dependency management)
- npm or yarn
- Qloo API key
- Gemini API key

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
poetry install

# Create a .env file
echo "QLOO_API_KEY=your_qloo_api_key" > .env
echo "GEMINI_API_KEY=your_gemini_api_key" >> .env

# Start the backend server
poetry run flask run --reload
```

The backend API will be available at [http://localhost:5000](http://localhost:5000) with interactive API documentation at [http://localhost:5000/docs](http://localhost:5000/docs).

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at [http://localhost:5173](http://localhost:5173).

## How It Works

1. **Data Collection**: The user enters information about a business, including its type, location, and products/offerings.

2. **Cultural Context Analysis**: The backend uses Qloo's API to gather relevant cultural insights about similar businesses, sustainability trends in the specified location, and industry-specific sustainability practices.

3. **AI Audit Generation**: Gemini AI processes this information to create a comprehensive sustainability audit that includes:
   - Overall sustainability score
   - Strengths in current practices
   - Areas for improvement
   - A specific, actionable tip

4. **Results Presentation**: The frontend displays the audit results in a user-friendly format, allowing users to sort and filter multiple audit reports.

## API Endpoints

### Create a Sustainability Audit

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

### List Sustainability Audits

```
GET /audit/list?order_by=sustainability_score&order=desc
```

## Development

### Backend

The backend is built with Flask and uses the following key components:

- **Flask-SMOREST**: For building a RESTful API with automatic documentation
- **Marshmallow**: For data validation and serialization
- **dotenv**: For environment variable management
- **Qloo API**: For cultural insights data
- **Gemini API**: For AI-powered analysis

For more details, see the [backend README](backend/README.md).

### Frontend

The frontend is built with React and uses the following key components:

- **React**: For building the user interface
- **TypeScript**: For type-safe code
- **Axios**: For API requests
- **Vite**: For fast development and building

For more details, see the [frontend README](frontend/README.md).

## Contributing

We welcome contributions to improve EcoAudit AI!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Acknowledgments

- [Qloo API](https://qloo.com/) for providing cultural insights data
- [Gemini AI](https://gemini.google.com/) for powering the sustainability analysis
