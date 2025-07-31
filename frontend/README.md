# EcoAudit AI Frontend

A modern React application providing an intuitive interface for conducting business sustainability audits using AI-powered analysis. This frontend connects to the EcoAudit AI backend to deliver comprehensive sustainability insights with a clean, responsive UI.

## ✨ Features

- **Intuitive Multi-Step Form**: Guide users through the audit process with a clear, step-by-step interface
- **Dynamic Loading Animations**: Provide visual feedback during audit generation
- **Comprehensive Report Display**: Present sustainability scores and recommendations in an accessible format
- **Audit History**: Access and reload previous sustainability audits
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Modern UI Components**: Built with shadcn/ui for a clean, professional appearance

## 🛠️ Tech Stack

- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Next-generation frontend tooling for faster development
- **Axios**: Promise-based HTTP client for API requests
- **shadcn/ui**: High-quality UI components built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Docker**: Containerization for easy deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0+
- npm or yarn
- Backend API running (see backend README)

### Local Development Setup

1. **Clone the Repository and Navigate to Frontend**
   ```bash
   git clone https://github.com/readysethack/eco-audit-ai.git
   cd qloo-hackathon-app/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the `frontend/` directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist/` directory.

### Docker Deployment

1. **Build and Start with Docker Compose**
   ```bash
   # From the root directory
   docker-compose build frontend
   docker-compose up -d frontend
   ```

## 📁 Project Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/
│   │   ├── eco-audit/     # Application-specific components
│   │   │   ├── AuditForm.tsx
│   │   │   ├── LoadingView.tsx
│   │   │   └── ReportView.tsx
│   │   └── ui/            # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   ├── hooks/             # Custom React hooks
│   │   └── useLoadingAnimation.ts
│   ├── lib/               # Utility libraries
│   │   ├── axios.ts       # API client configuration
│   │   └── utils.ts       # Shared utility functions
│   ├── services/          # API service layer
│   │   └── auditService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── eco-audit.ts
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── Dockerfile             # Docker configuration
├── nginx.conf             # Nginx configuration for production
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## 🧩 Component Architecture

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

## 🎯 Application Features

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT
