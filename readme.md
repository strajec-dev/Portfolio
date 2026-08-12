# Strajec Portfolio — Frontend

Modern, premium developer portfolio website with a custom admin dashboard for managing inquiry leads and analyzing visitor metrics.

---

## Key Features

- **Responsive Landing Page** — Sleek dark mode aesthetics, dynamic animations, and clean layouts
- **Interactive Contact Form** — Direct submission to the Django backend database
- **Premium Admin Dashboard** — Real-time metrics overview, lead list management (Status options: Contacted, In Progress, Closed), and unread indicators
- **Dynamic Charts** — Visual analytics charts rendering Google Analytics data via Chart.js
- **Google Analytics Integration** — Aggregated page views by weekly, monthly, and yearly intervals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Core | React 18 (Vite) |
| Styling | CSS (TailwindCSS & Vanilla modules) |
| Icons | Lucide React |
| Graphs | Chart.js (CDN configuration) |
| Hosting | Vercel (Frontend Hosting) |

---

## Quick Start

### 1. Clone & Set Up Environment

```bash
git clone https://github.com/magnet-solution/Portfolio.git
cd Portfolio

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_BACKEND_URL=https://strajec-backend.vercel.app
```

### 3. Launch the Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## Production Deployment (Vercel)

This frontend repository deploys automatically to Vercel when changes are pushed to `main` / `master`.

### Environment Variable configuration:

Ensure you add the backend endpoint variable in Vercel project environment settings:

- **Key**: `VITE_BACKEND_URL`
- **Value**: `https://strajec-backend.vercel.app` (your Vercel backend deployment URL)

### Compiling manually:
```bash
npm run build
```
This command compiles the project files into a production-optimized bundle located in the `dist` directory.
