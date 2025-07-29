# EcoAudit API Backend

A Flask REST API for generating sustainability audits for businesses using Qloo and Gemini AI.

## Features
- Generate sustainability audits for any business
- List and sort audits by name, date, or score
- Returns strengths, improvement suggestions, and actionable tips

## Setup

### 1. Clone and Install
```bash
git clone https://github.com/readysethack/eco-audit-ai.git
cd qloo-hackathon-app/backend
poetry install
```

### 2. Environment Variables
Create a `.env` file in the `backend/` folder:
```
QLOO_API_KEY=your_qloo_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Activating the Virtual Environment
```bash
$ eval $(poetry env activate)
(test-project-for-test) $  # Virtualenv entered
$ eval (poetry env activate)
(test-project-for-test) $  # Virtualenv entered
PS1> Invoke-Expression (poetry env activate)
(test-project-for-test) PS1>  # Virtualenv entered
```

### 4. Run the API Locally
```bash
flask run --reload
```

API docs available at: [http://localhost:5000/docs](http://localhost:5000/docs)

## Endpoints

### Create Audit
`POST /audit/list`

**Request JSON:**
```json
{
  "business_type": "independent vegan café",
  "location": "brussels",
  "products": ["oat milk", "handmade ceramics", "locally roasted beans"]
}
```

**Response JSON:**
```json
{
  "id": "uuid-string",
  "created": "2025-07-29T12:00:00Z",
  "business_name": "The Independent Vegan Café, Brussels",
  "sustainability_score": 8.5,
  "strengths": ["..."],
  "improvements": ["..."],
  "tip": "..."
}
```

### List Audits
`GET /audit/list?order_by=sustainability_score&order=desc`

**Query Parameters:**
- `order_by`: business_name | created | sustainability_score
- `order`: asc | desc

**Response JSON:**
```json
{
  "audits": [
    {
      "id": "uuid-string",
      "created": "2025-07-29T12:00:00Z",
      "business_name": "The Independent Vegan Café, Brussels",
      "sustainability_score": 8.5,
      "strengths": ["..."],
      "improvements": ["..."],
      "tip": "..."
    }
  ]
}
```

## Project Structure
```
backend/
├── app.py         # Main API file
└── utils/
    └── utils.py   # Qloo & Gemini integration
```

## License
MIT
