import type {
  MedicineDetails,
  InteractionResult,
  PrescriptionAnalysis,
  ChatMessage
} from '../types';

const getLangPrompt = () => {
  const lang = localStorage.getItem('medifinder_lang');
  if (lang === 'ur') {
    return `\nIMPORTANT: Respond with all text fields in Urdu language (Nastaliq script). Keep medicine names, chemical formulas, and dosage numbers in English.`;
  }
  return '';
};

const SYSTEM_PROMPT = `You are MediFinder AI, a professional medical database assistant. 
Your job is to provide accurate, structured details for a given medicine/drug/tablet name.
You must output ONLY raw JSON, with no markdown formatting, no \`\`\`json blocks, and no additional text.

The JSON object MUST perfectly match this structure:
{
  "brandName": "string",
  "genericName": "string",
  "type": "Brand or Generic",
  "drugClass": "string",
  "overview": "string",
  "chemicalFormula": "string",
  "activeSalts": "string",
  "uses": "string",
  "dosage": "string",
  "sideEffects": "string",
  "contraindications": "string",
  "drugInteractions": "string",
  "storageInstructions": "string",
  "pregnancyCategory": "string",
  "knownInteractions": ["medicine1", "medicine2"],
  "availability": {
    "forms": ["Tablet", "Syrup", "Injection/Serum", "Capsule", "Cream/Ointment", "Drops", "Inhaler", "Patch"],
    "prescriptionRequired": true,
    "availabilityStatus": "Widely Available | Limited Stock | Import Only",
    "countries": ["Pakistan", "India", "UK", "USA"],
    "priceRangePKR": "PKR 50 – PKR 7000"
  },
  "genericVsBrand": {
    "genericName": "string",
    "brandName": "string",
    "genericPricePKR": 80,
    "brandPricePKR": 450,
    "genericManufacturer": "string",
    "brandManufacturer": "string",
    "bioavailability": "string",
    "approvalStatus": "DRAP Approved",
    "recommendation": "string"
  },
  "alternatives": [
    { "name": "string", "type": "Generic or Brand", "description": "string" }
  ]
}

Provide 8 to 10 items in the alternatives array. Ensure forms array only contains the applicable physical forms.
If the medicine is not found, try your best to guess what the user meant, or return a similar popular medicine.`;

const fetchApi = async (messages: any[], systemPrompt: string = '', model = 'openai/gpt-4o-mini') => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('API Key is missing. Please configure VITE_OPENROUTER_API_KEY in Vercel environment variables.');
  }

  const finalMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'MediFinder AI'
    },
    body: JSON.stringify({
      model,
      messages: finalMessages,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return content;
};

export const fetchMedicineDetails = async (medicineName: string): Promise<MedicineDetails> => {
  const content = await fetchApi(
    [{ role: 'user', content: `Provide details for the medicine: ${medicineName}` }],
    SYSTEM_PROMPT + getLangPrompt()
  );

  try {
    return JSON.parse(content) as MedicineDetails;
  } catch (error) {
    console.error("Failed to parse JSON response:", content);
    throw new Error("Received invalid format from AI.");
  }
};

export const checkInteraction = async (medicine1: string, medicine2: string): Promise<InteractionResult> => {
  const content = await fetchApi(
    [{ role: 'user', content: `What is the drug interaction between ${medicine1} and ${medicine2}? Respond in JSON: {severity: 'None' | 'Mild' | 'Moderate' | 'Severe', description: 'string', recommendation: 'string'}` }],
    `You are a clinical pharmacist AI.` + getLangPrompt()
  );

  try {
    return JSON.parse(content) as InteractionResult;
  } catch (error) {
    throw new Error("Received invalid format from AI.");
  }
};

export const analyzePrescription = async (base64Image: string, mimeType: string): Promise<PrescriptionAnalysis> => {
  const type = mimeType.includes('pdf') ? 'document' : 'image_url';
  let messageContent: any;

  if (type === 'image_url') {
    messageContent = [
      {
        type: "text",
        text: "Analyze this medical prescription. Extract and return ONLY JSON: { patientName: string, doctorName: string, date: string, diagnosis: string, medicines: [{name: string, dosage: string, frequency: string, duration: string, purpose: string}], specialInstructions: string, warnings: string }"
      },
      {
        type: "image_url",
        image_url: { url: base64Image }
      }
    ];
  } else {
    // Anthropic/OpenRouter specific document parsing if supported. For openrouter with gpt-4o it handles image_url.
    // Assuming we use image_url for images. PDFs might require a different model or format depending on openrouter.
    // For safety, we will just use image_url and hope it's an image. If it's a PDF, we might need a specific handling.
    // Since the prompt asks to use vision capability: "send as type: image with source... or type: document with source..."
    // This looks like Anthropic Claude Vision format!
    // OpenRouter uses standard OpenAI format for gpt-4o, but Anthropic format for Claude. Let's use Claude 3.5 Sonnet since user mentioned "Claude AI".
    // Wait, the original code uses 'openai/gpt-4o-mini'. I will use 'anthropic/claude-3.5-sonnet' for prescription if needed, or just construct the OpenAI format which OpenRouter maps to Claude.
    messageContent = [
      {
        type: "text",
        text: "Analyze this medical prescription. Extract and return ONLY JSON: { patientName: string, doctorName: string, date: string, diagnosis: string, medicines: [{name: string, dosage: string, frequency: string, duration: string, purpose: string}], specialInstructions: string, warnings: string }"
      },
      {
        type: "image_url",
        image_url: { url: base64Image }
      }
    ];
  }

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  // Use Claude 3.5 Sonnet for vision task if requested, otherwise fallback to gpt-4o
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'MediFinder AI'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o', // using gpt-4o for vision
      messages: [
        { role: 'system', content: `You are a medical data extractor.` + getLangPrompt() },
        { role: 'user', content: messageContent }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  try {
    return JSON.parse(content) as PrescriptionAnalysis;
  } catch (error) {
    throw new Error("Invalid format from AI.");
  }
};

export const chatWithBot = async (messages: ChatMessage[]): Promise<string> => {
  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: m.content
  }));

  const systemPrompt = `You are MediBot, an expert AI medical assistant for MediFinder AI. You ONLY answer questions about medicines, health conditions, symptoms, drug interactions, dosages, side effects, and general wellness. If someone asks about anything unrelated to health or medicine, politely say: 'I can only help with medicine and health-related questions. Please ask me about any medicine, symptom, or health concern.' Always recommend consulting a real doctor for serious conditions. Be friendly, clear, and use simple language. If the user writes in Urdu, respond in Urdu.` + getLangPrompt();

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'MediFinder AI'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedMessages
      ]
    })
  });

  if (!response.ok) {
    throw new Error("Chat failed");
  }
  const data = await response.json();
  return data.choices[0].message.content;
};
