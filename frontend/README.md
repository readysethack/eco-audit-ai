# EcoAudit AI Frontend

A React-based frontend for the EcoAudit AI application, providing a user-friendly interface to generate sustainability audits for businesses.

## Features

- Request sustainability audits for any business
- View sustainability scores, strengths, and improvement suggestions
- Sort and browse existing audit reports
- Responsive design for desktop and mobile devices

## Technology Stack

- **React**: UI library for building the interface
- **TypeScript**: For type-safe code
- **Axios**: For API requests
- **Vite**: Fast development and build tool

## Setup

### 1. Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend server running (see the backend README)

### 2. Installation

```bash
# Clone the repository (if not already done)
git clone https://github.com/readysethack/eco-audit-ai.git
cd eco-audit-ai/frontend

# Install dependencies
npm install
```

### 3. Configuration

The application is configured to communicate with the backend API running at `http://localhost:5000`. If your backend is running on a different port or host, update the proxy settings in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/audit': {
      target: 'http://localhost:5000',  // Change this if needed
      changeOrigin: true,
      secure: false,
    },
  },
},
```

### 4. Running the Application

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is already in use).

## Usage

1. **Submit a New Audit**:
   - Enter the business type (e.g., "organic bakery")
   - Enter the location (e.g., "portland")
   - Enter a comma-separated list of products/offerings (e.g., "sourdough bread, local jams, pastries")
   - Click "Submit" and wait for the AI to generate an audit

2. **View Audits**:
   - All audits are displayed below the form
   - Use the sort controls to order by date, business name, or sustainability score

## Building for Production

```bash
# Build the application for production
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```
frontend/
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # React components
│   │   ├── AuditForm.tsx    # Form for submitting new audits
│   │   └── AuditList.tsx    # List of existing audits
│   ├── App.tsx        # Main application component
│   ├── App.css        # Application styles
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
