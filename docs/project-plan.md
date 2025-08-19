# **Consolidated Project Plan: AI Evaluation System POC**

This document provides a comprehensive plan for the AI Evaluation System Proof of Concept, from high-level business goals to a detailed, actionable software specification and development roadmap.

## **1\. Business Requirements Document (BRD)**

### **1.1 Project Overview**

* **Business Goal:** To prove that AI can streamline and improve the employee evaluation process by making it less time-consuming and biased. This Proof of Concept (POC) will achieve this by creating a user-friendly web application that demonstrates the AI evaluation workflow to non-technical stakeholders (like HR), abstracting away the underlying technical complexity of JSON files and manual data handling.  
* **Success Metrics:**  
  * Receive positive confirmation from the HR stakeholder that the new web interface is intuitive and addresses their concerns about complexity.  
  * Successfully demonstrate the end-to-end mocked user flow: viewing a team dashboard, uploading performance artifacts, and viewing a dynamic individual employee dashboard that visualizes the AI's final analysis.

### **1.2 User Personas**

* **HR Manager:** A non-technical user responsible for overseeing the employee evaluation process. They need a simple, visual, and intuitive tool to manage evaluations and view results without interacting with raw data files or code.

### **1.3 User Stories & Functional Requirements**

#### **Feature 1: Team Dashboard**

* **User Story:** As an HR Manager, I want to see a main dashboard with a list of all employees and a clear way to upload new performance artifacts for the team.  
* **Functional Requirements:**  
  * The page must display a list or grid of employees using card-based UI.  
  * Each employee card will contain a main link on the employee's name/card body to navigate to their individual Employee Dashboard.  
  * The page must feature a single, prominent "Upload Artifacts" button (e.g., in the header or as a primary action button) that navigates to the global Artifact Upload Page.  
  * For this POC, the dashboard will display the following static team members from "Team Bangan":  
    * **Andres Kapitan** (ID: 110, Position: Manager)  
    * **Pedro Bostos** (ID: 111, Position: Senior Developer)  
    * **Maria Makiling** (ID: 112, Position: Senior Developer)  
    * **Jose Martinez** (ID: 113, Position: Junior Developer)

#### **Feature 2: Mock Artifact Upload & AI Analysis**

* **User Story:** As an HR Manager, I want to upload a single performance artifact and understand that the system can analyze it for all relevant employees mentioned within it.  
* **Functional Requirements:**  
  * The page must feature a drag-and-drop file upload component. This is a single page for the entire team, not for an individual employee.  
  * Upon file upload, the interface must display a sequence of status messages and loading indicators that visually represent the mocked AI analysis steps. The specific messages to be displayed in order are:  
    1. AI-Powered Artifact Analysis & Evidence Extraction...  
    2. Competency Factor Aggregation...  
    3. Competency Level Factor Scoring...  
    4. Competency Level Factor Conclusion...  
    5. Analysis Complete. Performance data has been updated.  
  * After the mock analysis is complete, the page should display a success message and a button to "Return to Team Dashboard". It should not redirect automatically.

#### **Feature 3: Dynamic Employee Dashboard**

* **User Story:** As an HR Manager, I want to view a dynamic and detailed dashboard for a single employee so that I can easily understand the final, visualized output of the AI evaluation without seeing any raw data.  
* **Functional Requirements:**  
  * The page must be a dynamic ReactJS version of the existing pure HTML dashboard.  
  * It must visually represent the key outputs of the AI analysis using charts and clean data presentation, replicating the look and feel of dashboard.html.  
  * The dashboard must be populated with data from the employee's corresponding JSON evaluation file.

## **2\. Solution Architecture**

### **2.1 System Overview**

This architecture describes a client-side-only web application built to serve as a Proof of Concept. The application will have no backend or database. All data, including team information and detailed employee evaluations, will be loaded from static JSON files stored within the project directory. The primary goal is to create a simple, responsive user interface to demonstrate the user flow to a non-technical stakeholder.

### **2.2 Micro-Architecture: A Layered Approach**

To ensure code quality, maintainability, and clear separation of concerns, this project will adopt a three-layer architecture pattern. This provides strong guardrails for the AI agent to prevent monolithic components and hardcoded logic.

* **1\. Hooks (Logic Layer):** All business logic, data fetching, and state management will be encapsulated in reusable custom hooks. This is the "brain" of the application.  
* **2\. Pages (Container Layer):** These are "smart" components that connect the logic to the UI. Their role is to call hooks, manage state, and pass data down to presentational components. They should contain minimal JSX.  
* **3\. Components (Presentation Layer):** These are "dumb" UI components. Their only responsibility is to render UI based on the props they receive. They are not aware of where the data comes from and contain no business logic.

### **2.3 HTML Migration Strategy & Data Flow Analysis**

The dashboard.html file is not just a design inspiration; it is the **source of truth for all business logic and data transformations**. The AI agent MUST perform a methodical migration, not a reinvention.

**Mandatory Analysis Process:**

1. **Identify Critical Variables:** In the \<script\> tag of dashboard.html, locate the primary data sources: employeeEvaluationData and companyCompetencyData. These are the inputs to all subsequent logic.  
2. **Identify Critical Calculation Sequence:** The script executes a specific, ordered sequence of calculations. This sequence is critical and MUST be replicated:  
   * **First:** The addAdjustedPointsToData() function is called. This function *mutates* the employeeEvaluationData object by adding a new adjustedPoints property to each factor's conclusion. This is a critical side effect.  
   * **Second:** The calculateSummaryData() function is called. This function depends on the adjustedPoints calculated in the previous step.  
   * **Third:** The chart series and options objects are constructed using the results from the previous calculations.  
3. **Identify Reusable Functions:** The script contains several pure functions that are candidates for reuse. These MUST be extracted into our /utils layer. Key functions to migrate include getFactors, calculateAverageAdjustedPoints, calculateAverageConclusionPoints, and calculateSummaryData.

### **2.4 Technology Stack**

* **Frontend Framework:** **ReactJS (with TypeScript)** using Vite for project setup.  
* **Styling:** **Bootstrap 5** and **Font Awesome 6** (via NPM).  
* **Data Visualization:** **ApexCharts** (via react-apexcharts wrapper).  
* **Deployment:** Static web hosting (e.g., Netlify, Vercel, GitHub Pages).

### **2.5 UI Design & Theme**

The UI should replicate the clean, professional aesthetic of the provided dashboard.html file.

* **Typography:** Main font should be 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif.  
* **Color Palette:**  
  * **Background:** Light gray (\#f8f9fa).  
  * **Cards:** White (\#ffffff) with a subtle box-shadow.  
  * **Header:** A blue linear gradient (linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(13,71,161,1) 35%, rgba(0,212,255,1) 100%)).  
  * **Accent/Conclusion:** Light cyan background (\#e9f7fd) with a darker cyan border (\#0dcaf0).  
* **Layout:** The layout will be built using Bootstrap's grid system. Key components will be structured within Card elements that have rounded corners (0.5rem) and soft shadows.  
* **Modals:** The detailed view for competency factors will use a large, centered Bootstrap modal.

### **2.6 Folder Structure**

To ensure simplicity and clear separation of concerns, the project will use the following folder structure:

```

/
|-- /public
|-- /src
|   |-- /components
|   |   |-- /charts
|   |   |   |-- CompetencyHeatmap.tsx
|   |   |   |-- LevelAnalysisRadar.tsx
|   |   |   |-- ComparisonRadarChart.tsx
|   |   |   |-- TrendSlopeChart.tsx
|   |   |-- /ui
|   |   |   |-- Card.tsx
|   |   |   |-- Button.tsx
|   |-- /data
|   |   |-- team-data.json
|   |   |-- company-competency.json
|   |   |-- employee-111.json
|   |   |-- employee-112.json
|   |   |-- employee-113.json
|   |-- /hooks
|   |   |-- useEmployeeData.ts
|   |-- /pages
|   |   |-- TeamDashboard.tsx
|   |   |-- ArtifactUploadPage.tsx
|   |   |-- EmployeeDashboard.tsx
|   |-- /types
|   |   |-- index.ts
|   |-- /utils
|   |   |-- chart-transformers.ts
|   |-- App.tsx
|   |-- main.tsx
|-- package.json
|-- tsconfig.json


```

### **2.7 Data Transformation Layer**

The raw employee evaluation data is not in the format required by ApexCharts. A set of utility functions must be created to transform this data. These functions will be located in src/utils/chart-transformers.ts. They will take two inputs: the raw employee-\[id\].json data and the company-competency.json framework. By combining these, they will produce the specific { series, options } objects that the react-apexcharts library expects. Each chart component will have its own dedicated transformer function (e.g., transformDataForHeatmap).

### **2.8 Coding Best Practices & Guardrails**

To ensure a high-quality, maintainable codebase, the AI agent MUST adhere to the following rules:

* **Strict Separation of Concerns:**  
  * **Components (/components) MUST be "dumb".** They should not contain any business logic, data fetching, or complex state management. Their only role is to render UI based on props.  
  * **Hooks (/hooks) MUST contain all business logic.** This includes data fetching, state management, and calling utility functions.  
  * **Pages (/pages) MUST be "containers".** Their role is to call hooks and pass the data to the UI components. They should not contain complex JSX.  
* **TypeScript Best Practices:**  
  * **No any or unknown:** Avoid using any or unknown types. Define specific, explicit types for all props, state, and function signatures in /types/index.ts.  
  * **Strong Typing for Props:** All component props must be explicitly typed.  
* **React Best Practices:**  
  * **No Inline Styles:** Do not use the style attribute for styling. All styling must be done using Bootstrap classes.  
  * **Component Granularity:** Break down complex UI into smaller, reusable components.

## **3\. Software Requirements Specification (SRS)**

* **File:** src/App.tsx  
  * **Component:** App  
  * **Description:** The root component. Manages routing between the main pages.  
* **File:** src/pages/TeamDashboard.tsx  
  * **Component:** TeamDashboard  
  * **Description:** A "container" component that fetches team data and renders the list of employees using presentational components.  
* **File:** src/pages/ArtifactUploadPage.tsx  
  * **Component:** ArtifactUploadPage  
  * **Description:** A "container" component that manages the state of the mock upload process.  
* **File:** src/pages/EmployeeDashboard.tsx  
  * **Component:** EmployeeDashboard  
  * **Description:** A "container" component. Its primary role is to get the employee ID from the URL, call the useEmployeeData hook, and pass the resulting data and chart configurations to the various presentational chart components.  
* **File:** src/hooks/useEmployeeData.ts  
  * **Hook:** useEmployeeData  
  * **Description:** A custom hook that takes an employeeId as an argument. It handles the logic for:  
    1. Dynamically importing the correct employee-\[id\].json and company-competency.json files.  
    2. Managing the loading and error states.  
    3. **Orchestrating the data transformation by calling the utility functions from chart-transformers.ts in the correct sequence as defined in the HTML Migration Strategy.**  
    4. Returning an object containing the employee's info, loading state, and the prepared chart data ({ series, options }) for all charts.  
* **File:** src/utils/chart-transformers.ts  
  * **Module:** Chart Transformers  
  * **Description:** A collection of pure, reusable functions migrated from dashboard.html. These functions are responsible for all complex business logic calculations and data transformations. They MUST NOT contain any React-specific code (hooks, JSX).

## **4\. Project Roadmap & Work Breakdown Structure**

### **Guiding Principles for the AI Agent**

You are an expert software engineer, not just a code generator. If any part of this plan seems technically infeasible, suboptimal, or inconsistent with the project goals, you are expected to raise the issue, explain the potential problem, and suggest a better alternative. Your role is to be a collaborative partner in building the best possible POC.

### **Milestone 1: Project Setup & Foundation**

**Objective:** Establish a runnable React \+ TypeScript project with a complete folder structure, all necessary dependencies, and empty page components with functional navigation.

### **1.1 Initialize Project and Install Dependencies**

**Suggested entry point(s):** Terminal / Command Prompt.

**Commands:**

```

# 1. Create the Vite project
npm create vite@latest . -- --template react-ts
# 2. Install all dependencies
npm install react-router-dom bootstrap @fortawesome/fontawesome-free apexcharts react-apexcharts
# 3. Install dev dependencies for type definitions if needed
npm install -D @types/bootstrap

```

**Acceptance Criteria:**

* A new React \+ TypeScript project is created.  
* All specified dependencies are listed in package.json.  
* npm run dev starts the development server without errors.

### **1.2 Scaffold Project Structure and Data Files**

**Suggested entry point(s):** The /src directory.

**Note:** Create a modified team-data.json that includes a hasData flag for each employee. For employee 110, this flag will be false. Do not create an employee-110.json file.

**Acceptance Criteria:**

* The complete folder structure from the Solution Architecture is created, including the /hooks and /utils directories.  
* employee-111.json, employee-112.json, employee-113.json, and company-competency.json are created in /src/data.  
* A team-data.json file is created with a hasData boolean property for each team member.  
* A types/index.ts file is created to hold all TypeScript interfaces.

### **1.3 Create Page Components and Basic Routing**

**Suggested entry point(s):** src/App.tsx, src/main.tsx.

**Acceptance Criteria:**

* TeamDashboard.tsx, ArtifactUploadPage.tsx, and EmployeeDashboard.tsx files are created in /src/pages, each returning a placeholder div.  
* Routing is implemented in App.tsx to handle the paths /, /upload, and /dashboard/:employeeId.  
* Bootstrap CSS is imported globally in main.tsx or App.tsx.

### **Milestone 2: Core Feature Implementation**

**Objective:** Develop the full functionality for all three pages, following the layered architecture.

### **2.1 Implement Team Dashboard**

**Suggested entry point(s):** src/pages/TeamDashboard.tsx.

**Acceptance Criteria:**

* The component imports team-data.json.  
* It maps over the team data to render a list of employees using Bootstrap cards.  
* The page includes a single \<Link\> styled as a button that navigates to the global /upload page.  
* If an employee's hasData flag is false, their dashboard link is disabled.

### **2.2 Implement Mock Artifact Upload Page**

**Suggested entry point(s):** src/pages/ArtifactUploadPage.tsx.

**Acceptance Criteria:**

* The page displays a UI for file dropping.  
* When a file is dropped, a setTimeout\-based sequence begins, displaying the specific status messages defined in the BRD.  
* After the final message, a success alert is shown with a \<Link\> button back to the Team Dashboard.

### **2.3 Migrate Business Logic from HTML to Utilities**

**Suggested entry point(s):** src/utils/chart-transformers.ts.

**Acceptance Criteria:**

* The agent MUST analyze the \<script\> tag in dashboard.html.  
* The agent MUST create and export pure TypeScript functions in chart-transformers.ts that replicate the logic of addAdjustedPointsToData, calculateSummaryData, and other helper functions.  
* All functions must be strongly typed and contain no React-specific code.  
* The output of these new functions must be verifiable against the outputs of the original JavaScript functions.

### **2.4 Implement Employee Data Hook**

**Suggested entry point(s):** src/hooks/useEmployeeData.ts.

**Acceptance Criteria:**

* The useEmployeeData hook is created. It accepts an employeeId.  
* It dynamically imports the required JSON data.  
* It calls the newly migrated functions from chart-transformers.ts in the **correct sequence** (e.g., first adding adjusted points, then calculating summary data).  
* It returns a single object containing all the data needed for the dashboard UI, including the final series and options for each chart.

### **2.5 Implement Employee Dashboard UI and Integration**

**Suggested entry point(s):** src/pages/EmployeeDashboard.tsx, src/components/charts/.

**Acceptance Criteria:**

* All chart components (CompetencyHeatmap.tsx, etc.) are created as "dumb" presentational components that only accept series and options props. They MUST NOT contain any business logic.  
* The EmployeeDashboard.tsx page component calls the useEmployeeData hook.  
* It handles loading and error states returned from the hook.  
* It passes the final, fully transformed data from the hook to the appropriate chart components.  
* The final rendered dashboard is visually identical to dashboard.html and displays the correctly calculated data.

