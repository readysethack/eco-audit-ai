# EcoAudit AI Backend

A powerful Flask-based REST API that generates comprehensive sustainability audits for businesses by leveraging the Qloo Cultural AI API and Google's Gemini AI.

## 🚀 Features

- **AI-Powered Sustainability Analysis**: Combines cultural data with sustainability metrics
- **Business Context Awareness**: Tailors recommendations based on business type, location, and offerings
- **Comprehensive Reporting**: Provides sustainability scores, strengths, improvement areas, and actionable tips
- **Flexible API**: Sort and filter audits by various parameters
- **Robust Error Handling**: Graceful handling of API failures with fallback responses
- **Health Check Endpoint**: Easily monitor API status and uptime

## ⚙️ Tech Stack

- **Flask**: Lightweight WSGI web application framework
- **Flask-SMOREST**: Extension for building RESTful APIs with automatic documentation
- **Marshmallow**: Schema validation and serialization
- **Google Gemini API**: AI-based analysis and report generation
- **Qloo API**: Cultural intelligence data for business insights
- **Gunicorn**: WSGI HTTP Server for production deployment
- **Docker**: Containerization for easy deployment

## 🛠️ Setup and Installation

### Prerequisites
- Python 3.9+
- Poetry (dependency management)
- Qloo API Key
- Gemini API Key

### Local Development Setup

1. **Clone the Repository and Navigate to Backend**
   ```bash
   git clone https://github.com/readysethack/eco-audit-ai.git
   cd qloo-hackathon-app/backend
   ```

2. **Install Dependencies**
   ```bash
   poetry install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend/` directory:
   ```
   QLOO_API_KEY=your_qloo_api_key
   GEMINI_API_KEY=your_gemini_api_key
   FLASK_ENV=development
   ```

4. **Activate the Virtual Environment**
   ```bash
   # Linux/macOS
   poetry shell
   
   # Windows PowerShell
   poetry shell
   ```

5. **Run the Development Server**
   ```bash
   flask run --reload
   ```

   The API will be available at [http://localhost:5000](http://localhost:5000)
   API documentation is available at [http://localhost:5000/docs](http://localhost:5000/docs)

### Docker Deployment

1. **Build and Start with Docker Compose**
   ```bash
   # From the root directory
   docker-compose build backend
   docker-compose up -d backend
   ```

## 📊 API Endpoints

### Health Check
```
GET /health
```
Returns API status and timestamp.

### Create Sustainability Audit
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
    "Core vegan and plant-based offerings inherently reduce environmental footprint, aligning with growing consumer demand for sustainable dietary choices in Brussels.",
    "Strong commitment to local sourcing, exemplified by locally roasted beans, minimizes transportation emissions and supports the local economy.",
    "Promotion of reusability through handmade ceramics significantly reduces single-use waste, fostering a circular economy approach."
  ],
  "improvements": [
    "Implement a comprehensive waste management program, including composting all organic waste such as coffee grounds and food scraps.",
    "Conduct an energy audit to identify opportunities for efficiency upgrades in lighting and appliances, potentially exploring renewable energy sources."
  ],
  "tip": "To further enhance your local appeal and sustainability, explore partnerships with local urban farms or small-batch producers in Belgium to incorporate hyper-seasonal ingredients into your menu, creating a unique 'Brussels terroir' experience for your patrons."
}
```

### List Audits
```
GET /audit/list?order_by=sustainability_score&order=desc
```

**Query Parameters:**
- `order_by`: `business_name` | `created` | `sustainability_score` (default: `created`)
- `order`: `asc` | `desc` (default: `asc`)

**Response (200 OK):**
```json
{
  "audits": [
    {
      "id": "bcaec2b4-1af7-468c-b475-5c437ccde903",
      "created": "2025-07-31T21:04:44.000000Z",
      "business_name": "The Independent Vegan Café, Brussels",
      "sustainability_score": 86,
      "strengths": ["..."],
      "improvements": ["..."],
      "tip": "..."
    }
  ]
}
```

## 📁 Project Structure

```
backend/
├── app.py                 # Main API entry point with route definitions
├── Dockerfile             # Docker configuration for containerization
├── pyproject.toml         # Poetry dependency management
├── requirements.txt       # Direct dependencies for Docker build
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
