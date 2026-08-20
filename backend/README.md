# Veenero Backend Starter

A TypeScript Node/Express backend architecture setup to scale into a robust SaaS backend service.

## Project Structure
- `src/controllers/`: Handle incoming HTTP request data and format outcomes.
- `src/routes/`: Route declarations connecting requests to specific controllers.
- `src/middleware/`: Express middlewares (authentication check, request validation, headers config).
- `src/models/`: Database schemas and ORM declarations.
- `src/services/`: Contain core business logic, third-party integrations, and operations.
- `src/config/`: Configuration setup, environment variables loader, and database clients.
- `src/utils/`: Common helpers (validators, formatters, loggers).
- `src/types/`: Typescript declarations and global overrides.
- `src/database/`: Seeds, migrations, and database schema updates.
- `src/interfaces/`: Type definitions mapping API formats and requests.
- `src/validators/`: Schema validators for incoming payloads (Zod/Joi).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   ```bash
   cp .env.example .env
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Build production code:
   ```bash
   npm run build
   ```
