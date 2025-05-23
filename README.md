# Bucket Flow Visualizer

This application visualizes the flow of loan applications through different 'buckets' based on defined conditions and actions.

## Project Structure

- `server.js`: The main Node.js/Express backend API server.
- `index.html`: Main HTML structure (served by Vite in dev, by Express in prod).
- `script.js`: Frontend JavaScript using ES modules, fetches data and renders the timeline.
- `style.css`: CSS for styling.
- `package.json`: Project configuration and dependencies.
- `README.md`: This file.
- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
- `dist/`: Directory containing the production build output from Vite (created by `npm run build`).
- `node_modules/`: Directory containing installed Node.js packages.

## Architectural Decisions

- **Backend:** Node.js with Express framework serving the `/api/buckets` endpoint on port 3001.
- **Frontend Build:** Uses **Vite** for development server (with hot module replacement) and production builds.
- **Data Fetching:** Frontend fetches data directly from the backend API (`http://localhost:3001/api/buckets`). CORS is enabled on the backend for development.
- **Frontend Visualization:** Uses **Vis.js Timeline** library (imported as ES module) to display buckets in swimlanes grouped by `ApplicationStatus`. Includes clustering with custom cluster content via `itemTemplate`.

## Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the root directory and add the API token:
    ```
    API_TOKEN=your_bearer_token_here
    ```
4.  **Run Development Servers:** `npm run dev`
    - This starts the Vite frontend server (usually on `http://localhost:5173` or similar - check console output) AND the backend Node.js server (on `http://localhost:3001`).
    - Open the frontend URL provided by Vite in your browser.
5.  **Run Production:** `npm start`
    - This first builds the frontend assets into the `dist/` folder using Vite.
    - Then, it starts the Node.js server (on port 3001), which now also serves the static files from `dist/`.
    - Open `http://localhost:3001` in your browser.

## Running Tests

Unit tests use **Jest** and **Supertest**. Execute all tests with:

```bash
npm test
```

## Changelog

- **2024-07-26:** Refactored frontend to use Vite build tool. Implemented `itemTemplate` for custom cluster content.
- **2024-07-26:** Implemented cluster click listener to show aggregated data via alert.
- **2024-07-26:** Added Vis.js Timeline clustering to prevent overlap.
- **2024-07-26:** Enhanced timeline items with condition/action details and adjusted view.
- **2024-07-26:** Fixed loading of vis-timeline assets.
- **2024-07-26:** Added Vis.js Timeline for visualization. Implemented basic grouping and item placement.
- **2024-07-26:** Initial project setup with Node.js/Express backend structure. 