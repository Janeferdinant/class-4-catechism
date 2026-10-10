# Configuration Directory

This directory contains configuration files for the Class 4 Catechism application.

## Files
- `app.config.json`: Master application configuration specifying default runtime port, themes, agent personas, neural audio voice profiles, and visual asset paths.

## Environment Variables
The application can also be configured via runtime environment variables or client-side storage:
- `PORT`: HTTP server port (Default: `8080`)
- `GEMINI_API_KEY`: Optional Google AI Studio Gemini API Key for live AI queries and agent explanations.
- `DEFAULT_THEME`: UI theme mode (`dark` or `light`).
