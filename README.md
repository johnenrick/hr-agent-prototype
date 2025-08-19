# AI Evaluation System POC

This is a Proof of Concept (POC) for an AI-driven employee evaluation system that demonstrates how AI can streamline and improve the employee evaluation process.

## Project Overview

The POC creates a user-friendly web application that abstracts away the technical complexity of employee evaluation data, making it accessible to non-technical stakeholders like HR managers.

## Features

- **Team Dashboard**: View all team members with their basic information
- **Artifact Upload**: Mock interface for uploading performance artifacts
- **Employee Dashboard**: Detailed competency analysis with interactive charts
- **AI Analysis Simulation**: Mock workflow showing the AI evaluation process

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 + Font Awesome 6
- **Charts**: ApexCharts with react-apexcharts wrapper
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Chart components
├── data/            # JSON data files
├── pages/           # Page components
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Data Structure

The application uses static JSON files for employee data:
- `team-data.json`: Team member information
- `employee-{id}.json`: Individual employee evaluation data

## Chart Components

- **CompetencyHeatmap**: Visualizes competency scores across levels
- **LevelAnalysisRadar**: Shows skill distribution analysis
- **TrendSlopeChart**: Displays competency trends over time
- **ComparisonRadarChart**: Compares employee performance to benchmarks

## Development Status

This is a POC project demonstrating the concept. The current implementation includes:
- ✅ Project setup and foundation
- ✅ Basic routing and page structure
- ✅ Data files and TypeScript interfaces
- 🔄 Chart components (in development)
- 🔄 Full dashboard implementation (in development)

## Author

John Enrick Plenos

## License

This is a proof of concept project.
