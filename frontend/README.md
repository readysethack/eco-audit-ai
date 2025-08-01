# EcoAudit AI Frontend

A modern React application that provides a simple, intuitive interface for small businesses to create and view sustainability audits.

## Features

- **Simple Form Input**: Easy-to-use interface for entering business details
- **Engaging Loading Experience**: Visual feedback during audit generation
- **Clear Report Visualization**: Easy-to-understand sustainability insights
- **Audit History**: View and compare past sustainability audits
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React + TypeScript**: Type-safe component development
- **Vite**: Fast, modern build tooling
- **shadcn/ui**: Accessible, customizable UI components
- **Tailwind CSS**: Utility-first styling
- **Axios**: API communication

## Quick Start

### Prerequisites
- Node.js 16.0+
- npm or yarn
- Backend API running

### Setup

```bash
# Install dependencies
npm install

# Configure environment (.env.local file)
VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

Application available at http://localhost:5173

### Docker Setup

```bash
# From project root
docker-compose build frontend
docker-compose up -d frontend
```

## Components

### Core Flow

1. **AuditForm**: Multi-step form collecting business information
   - Business type input
   - Location input
   - Products/offerings input

2. **LoadingView**: Animated interface shown during audit generation
   - Progress indicators
   - Contextual loading messages

3. **ReportView**: Displays the complete sustainability audit
   - Overall score visualization
   - Strengths with explanations
   - Improvement opportunities
   - Actionable sustainability tip

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── eco-audit/       # Business-specific components
│   │   │   ├── AuditForm.tsx
│   │   │   ├── LoadingView.tsx
│   │   │   └── ReportView.tsx
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API client services
│   │   └── auditService.ts
│   ├── types/               # TypeScript definitions
│   │   └── eco-audit.ts
│   └── App.tsx              # Main application component
├── Dockerfile               # Container configuration
└── package.json             # Dependencies and scripts
```

## Component Flow

```
+-------------+        +--------------+        +-------------+
|             |        |              |        |             |
| AuditForm   | -----> | LoadingView  | -----> | ReportView  |
|             |        |              |        |             |
+-------------+        +--------------+        +-------------+
      |                                               |
      |                                               |
      +-----------------------------------------------+
                      Audit History
```

## Key User Flows

1. **Creating a New Audit**:
   - Enter business details in the multi-step form
   - View engaging loading animation during processing
   - Review comprehensive sustainability audit results

2. **Viewing Audit History**:
   - Access list of previously generated audits
   - Sort by different criteria (name, date, score)
   - Select and view detailed audit reports

## Development Guidelines

- Use TypeScript for all new components
- Follow the existing component structure
- Leverage shadcn/ui components for UI elements
- Use the established API service for backend communication

## Complete Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── eco-audit/       # Business-specific components
│   │   │   ├── AuditForm.tsx
│   │   │   ├── LoadingView.tsx
│   │   │   └── ReportView.tsx
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   │   └── auditService.ts
│   ├── types/               # TypeScript definitions
│   │   └── eco-audit.ts
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── Dockerfile               # Docker configuration
├── nginx.conf               # Nginx configuration for production
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## Component Architecture

### Main Components

- **App.tsx**: Main container that manages application state and view transitions
- **AuditForm.tsx**: Multi-step form for collecting business information
- **LoadingView.tsx**: Animated loading screen displayed during audit generation
- **ReportView.tsx**: Displays the sustainability audit results

### Data Flow

1. **User Input**: Data collection through AuditForm
2. **API Requests**: Handled by auditService
3. **Loading State**: Managed with custom useLoadingAnimation hook
4. **Display Results**: Presented through ReportView

## Application Features

### Multi-Step Form
The application guides users through a series of inputs to collect necessary information for the sustainability audit:
- Business name
- Business type
- Location
- Products/offerings

### Loading Animation
A sophisticated loading animation is displayed while the backend processes the audit request, providing:
- Progress indication
- Simulated processing steps
- Visual engagement during wait time

### Results Display
The audit results are presented in a clear, informative manner:
- Overall sustainability score
- Color-coded score indicator
- Key strengths (with detailed explanations)
- Areas for improvement
- Actionable sustainability tip

### Audit History
Users can access previous audits through the history menu, allowing them to:
- View past audit results
- Compare different businesses
- Track sustainability progress over time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT
