# MediFinder AI 💊

MediFinder AI is a professional, high-performance medicine search engine and medical assistant platform. It leverages advanced Artificial Intelligence to provide instant, comprehensive details about medications, including compositions, dosages, side effects, and therapeutic alternatives.

**Team Name**: UNKNOWN  
**Team Lead**: M. Majid Khan  
**Documentation**: [Detailed Project Report](./PROJECT_DOCUMENTATION.md) | [Presentation Slides](./PRESENTATION_SLIDES.md)

## 🚀 Key Features

- **AI-Powered Search**: Instant retrieval of structured medical data using OpenRouter (Claude AI / GPT-4o).
- **Drug Interaction & Safety Checker**: Live tool to check potential interactions between two medications with severity levels.
- **Generic vs Brand Comparison**: Detailed side-by-side analysis of pricing, manufacturers, and bioavailability.
- **Prescription Scanner**: AI-driven document reader that extracts patient info and medicine lists from uploaded images or PDFs.
- **Nearby Pharmacy Finder**: Real-time integration with Google Maps and Places API to locate open pharmacies nearby.
- **AI Medical Chatbot (MediBot)**: A dedicated health assistant for answering wellness and medication-related questions.
- **Bilingual Support (Urdu/English)**: Full RTL layout support for Urdu speakers with translated UI and AI responses.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript.
- **Styling**: Vanilla CSS3 with Custom Design System tokens.
- **AI Integration**: Claude 3.5 Sonnet (via OpenRouter API).
- **External APIs**: Google Maps JavaScript API, Google Places API.
- **State Management**: React Context & LocalStorage.

## 📦 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file and add:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_key
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📜 Disclaimer

MediFinder AI is an informational tool and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a healthcare professional before taking any medication.

---
Made by **RedHeart** with **CloudXify**
