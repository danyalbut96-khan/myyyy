import type { MedicineDetails } from '../types';

const SYSTEM_PROMPT = `You are MediFinder AI, a professional medical database assistant. 
Your job is to provide accurate, structured details for a given medicine/drug/tablet name.
You must output ONLY raw JSON, with no markdown formatting, no \`\`\`json blocks, and no additional text.

The JSON object MUST perfectly match this structure:
{
  "brandName": "String",
  "genericName": "String",
  "category": "String",
  "chemicalFormula": "String",
  "composition": "String",
  "uses": "String",
  "dosage": "String",
  "sideEffects": "String",
  "contraindications": "String",
  "manufacturer": "String",
  "summary": "Plain language summary (2-3 sentences)",
  "alternatives": [
    {
      "name": "String",
      "type": "Generic" or "Brand",
      "note": "Short brief note"
    }
  ]
}

Provide 12 to 15 items in the alternatives array.
If the medicine is not found, try your best to guess what the user meant, or return a similar popular medicine.`;

export const fetchMedicineDetails = async (medicineName: string): Promise<MedicineDetails> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key is missing. Please configure VITE_OPENROUTER_API_KEY in Vercel environment variables.');
  }

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
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Provide details for the medicine: ${medicineName}` }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content) as MedicineDetails;
  } catch (error) {
    console.error("Failed to parse JSON response:", content);
    throw new Error("Received invalid format from AI.");
  }
};
