# System Design - MediFinder AI

This document outlines the architecture, logic flow, and system structure of the MediFinder AI platform.

## 🏗 Architecture Overview

MediFinder AI is built as a single-page application (SPA) using **Next.js** and **React**, following a modular component-based architecture. It operates primarily as an interface between the user and Large Language Models (LLMs) via the **OpenRouter API** (powered by **Claude AI**).

### 1. Logic & Data Flow
The system follows a stateless data flow:
1. **User Query**: The user enters a medicine name or uploads a prescription.
2. **API Service**: The request is formatted with a specific **System Prompt** designed to enforce strict JSON output.
3. **AI Processing**: Claude 3.5 Sonnet or GPT-4o processes the request and returns structured data.
4. **Parsing & Rendering**: The frontend parses the JSON and maps it to specific UI components (Cards, Tables, Grids).

### 2. The Problem & Solution
**Problem**: Traditional medical databases are either too complex for laypeople or too fragmented to find all information (alternatives, prices, interactions) in one place.
**Solution**: MediFinder AI uses LLMs to synthesize fragmented data into a cohesive, easy-to-read medical "info sheet" instantly, providing a unified medical assistant.

### 3. Component Structure
- **Layout**: Sticky headers/footers with global state awareness (Language, Search History).
- **Services (api.ts)**: A centralized module handling all external communication, prompt construction, and error handling.
- **Pages**: Functional views (Home, Result, Safety, Compare, etc.) that manage their own loading and error states.
- **ChatBot**: A persistent floating component that maintains its own conversation history in LocalStorage for cross-page assistance.

### 4. Language Engine (RTL Support)
The platform handles bilingual support through a combination of:
- **Global State**: Tracking `medifinder_lang` in LocalStorage.
- **CSS Variables**: Dynamically switching fonts (DM Sans vs Noto Nastaliq Urdu) and directions (`dir="rtl"`).
- **Conditional Prompting**: Automatically appending Urdu-specific instructions to every AI request when the mode is active.

### 5. Security & Key Management
- **Environment Variables**: API keys are never hardcoded and are managed through Vite's `import.meta.env`.
- **LocalStorage**: Sensitive health queries are stored only on the user's local device and never transmitted to our backend servers.

---
MediFinder AI: Modernizing healthcare information retrieval with AI.
