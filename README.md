# Veenero Website (Full-Stack SaaS Repository)

This repository contains the Veenero website, restructured into a professional full-stack layout separating the frontend application from backend services.

## Repository Directory Hierarchy

```
project-root/
 ├── frontend/       # Complete React + Vite + TypeScript application (Phases 1-4)
 ├── backend/        # TypeScript Node/Express backend starter modules
 ├── docs/           # Specifications, scripts, and administrative documentation
 ├── README.md       # Root-level configuration and instructions
 └── .gitignore      # Root-level Git ignores
```

---

## Folder Details

### 1. Frontend (`frontend/`)
The React user interface built during Phases 1–4. It operates on Vite, TypeScript, and TailwindCSS.
- **Setup & Run**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- **Build**:
  ```bash
  cd frontend
  npm run build
  ```

### 2. Backend (`backend/`)
A TypeScript Node/Express starter structure pre-configured for future service development.
- **Setup & Run**:
  ```bash
  cd backend
  npm install
  npm run dev
  ```
- **Structure**: Includes dedicated folders for controllers, routes, models, middleware, schemas, database config, and services.

### 3. Docs (`docs/`)
Administrative utilities and files (e.g. `TODO.md`).

---

## Production Build & Verification

To verify that the frontend functionality compiles successfully in the new directory:
```bash
cd frontend
npm install
npm run build
```