# Presentation Slides - MediFinder AI

## 📽️ Slide 1: Problem Statement
**"The Healthcare Information Gap"**
- **Fragmentation**: Medical data is scattered and hard to find.
- **Complexity**: Laypeople struggle to understand pharmaceutical terms.
- **Language Barrier**: 100M+ Urdu speakers lack accessible medical tools.
- **Illegibility**: Handwritten prescriptions are difficult to read and error-prone.
- **Solution**: A unified, bilingual AI assistant that simplifies health data.

---

## 🏗️ Slide 2: System Design
**"Modern Serverless Architecture"**
- **Frontend**: React 18 + Vite (SPA) with full RTL/LTR support.
- **Backend-less**: Interfaces directly with LLMs via API Service layer.
- **Data Flow**: Stateless prompt-response cycle using OpenRouter.
- **Integrations**: 
  - Google Maps for real-time pharmacy geolocation.
  - LocalStorage for persistent search history and history tracking.
- **Security**: Data-privacy first; no sensitive files stored on servers.

---

## 🤖 Slide 3: AI Integration
**"The Intelligence Core"**
- **Engine**: Claude 3.5 Sonnet (OpenRouter API).
- **Vision**: OCR and semantic analysis of handwritten prescriptions.
- **Structured Logic**: Enforced JSON outputs for consistent UI mapping.
- **Safety**: Automated drug-to-drug interaction checker.
- **Bilingual Context**: Smart translation engine for medical Urdu.
- **Personalization**: "MediBot" Chatbot for natural language health queries.
