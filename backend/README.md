# EcoAudit AI Backend

A Flask-based REST API that generates tailored sustainability audits for small businesses using Qloo's cultural insights and Gemini AI.

## Features

- **AI-Powered Analysis**: Combines Qloo cultural data with Gemini AI
- **Business-Specific Recommendations**: Tailored to business type, location, and offerings
- **Small Business Focus**: Practical, cost-effective sustainability guidance
- **Flexible Filtering**: Sort and filter audits by various parameters
- **Error Resilience**: Graceful handling of API failures with fallback responses

## Tech Stack

- **Flask & Flask-SMOREST**: API framework with auto-documentation
- **Marshmallow**: Data validation and serialization
- **Gemini AI**: Contextual analysis and recommendation generation
- **Qloo API**: Cultural intelligence data
- **Gunicorn**: Production-ready WSGI server
- **Docker**: Containerization

## Quick Setup

### Prerequisites
- Python 3.9+
- Qloo API Key + Gemini API Key

### Local Development

```bash
# Install dependencies
poetry install

# Configure environment (.env file)
QLOO_API_KEY=your_qloo_api_key
GEMINI_API_KEY=your_gemini_api_key
FLASK_ENV=development

# Run server
poetry run flask run --reload
```

API available at http://localhost:5000 with docs at http://localhost:5000/docs

### Docker Setup

```bash
# From project root
docker-compose build backend
docker-compose up -d backend
```

## API Endpoints

### Health Check
```
GET /health
```
Returns API status and timestamp.

### Create Sustainability Audit
```
POST /audit/list
```

**Request:**
```json
{
  "business_type": "independent vegan café",
  "location": "brussels",
  "products": ["oat milk", "handmade ceramics", "locally roasted beans"]
}
```

**Response:**
```json
{
  "id": "bcaec2b4-1af7-468c-b475-5c437ccde903",
  "created": "2025-07-31T21:04:44Z",
  "business_name": "The Independent Vegan Café, Brussels",
  "sustainability_score": 86,
  "strengths": [
    "Core vegan offerings reduce environmental footprint...",
    "Local sourcing minimizes transportation emissions...",
    "Reusable ceramics reduce single-use waste..."
  ],
  "improvements": [
    "Implement composting for organic waste...",
    "Conduct energy audit for efficiency upgrades..."
  ],
  "tip": "Partner with local urban farms for seasonal ingredients..."
}
```

### List Audits
```
GET /audit/list?order_by=sustainability_score&order=desc
```

**Parameters:**
- `order_by`: `business_name`, `created`, `sustainability_score` (default: `created`)
- `order`: `asc`, `desc` (default: `asc`)

**Response:**
```json
{
  "audits": [
    {
      "id": "bcaec2b4-1af7-468c-b475-5c437ccde903",
      "created": "2025-07-31T21:04:44Z",
      "business_name": "The Independent Vegan Café, Brussels",
      "sustainability_score": 86,
      "strengths": ["..."],
      "improvements": ["..."],
      "tip": "..."
    }
  ]
}
```

### Get Specific Audit
```
GET /audit/{audit_id}
```

**Response:** Full audit details for the specified ID

## Implementation Notes

- **Cultural Context**: The system analyzes regional business practices
- **Small Business Focus**: All recommendations are practical for small businesses
- **Fallback Handling**: Graceful degradation when external APIs fail
- **Scalability**: Containerized for easy deployment and scaling

## Code Structure

```
backend/
├── app.py           # API endpoints and route definitions
├── utils/
│   └── utils.py     # Core business logic and API integration
├── Dockerfile       # Container configuration
├── pyproject.toml   # Poetry dependency management
└── requirements.txt # Direct dependencies for Docker
```
├── __pycache__/           # Python cache files
└── utils/
    ├── test_data.txt      # Sample data for testing
    ├── test.py            # Test scripts
    ├── utils.py           # Core business logic and API integrations
    └── __pycache__/       # Python cache files
```

## 🔍 How It Works

1. **Data Collection**: The API receives business information including type, location, and products.

2. **Sustainability Tags**: Fetches relevant sustainability tags from Qloo's API.

3. **Local Business Analysis**: Queries for similar businesses in the same location to establish benchmarks.

4. **Score Calculation**: Calculates a sustainability score based on affinity, popularity, and tag matches.

5. **AI Report Generation**: Uses Gemini AI to analyze the data and generate actionable insights.

6. **Response Delivery**: Returns a comprehensive audit with all relevant metrics and recommendations.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT
