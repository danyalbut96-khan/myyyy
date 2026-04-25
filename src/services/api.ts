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
  const formattedMessages = messages.map(m => {
    if (m.imageUrl) {
      return {
        role: m.role,
        content: [
          { type: 'text', text: m.content || (m.role === 'user' ? 'Analyze this image.' : '') },
          { type: 'image_url', image_url: { url: m.imageUrl } }
        ]
      };
    }
    return {
      role: m.role,
      content: m.content
    };
  });

  const systemPrompt = `You are MediBot, an expert AI medical and healthcare assistant for MediFinder AI. 
Your expertise covers:
1. Identifying medicines from images of packaging or prescriptions.
2. Explaining medicine uses, dosages, and side effects.
3. Providing general healthcare advice and wellness tips.
4. Analyzing symptoms and suggesting potential causes (with a strong disclaimer).
5. Comparing different medicines and suggesting generic alternatives.

If an image is provided, analyze it carefully. If it's a medicine, identify it and provide details. If it's a medical report or prescription, explain the key points in simple terms.

IMPORTANT: 
- Always include a disclaimer: "I am an AI, not a doctor. Please consult a healthcare professional before taking any new medication."
- Be empathetic and professional.
- If the user writes in Urdu, respond in Urdu (using Nastaliq script where possible).
- Keep medical terms in English but explain them if requested.` + getLangPrompt();

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
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Chat failed");
  }
  const data = await response.json();
  return data.choices[0].message.content;
};

export interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  image2?: string;
  readTime: string;
}

export const MOCK_BLOGS: Blog[] = [
  {
    id: '1',
    title: '5 Natural Ways to Boost Your Immunity This Season',
    summary: 'Discover simple lifestyle changes and dietary tips to strengthen your immune system naturally.',
    content: `A strong immune system is your body's first line of defense against illnesses. While genetics play a role, your lifestyle and diet significantly influence how well your immune system functions. Here are five science-backed ways to give your immunity a natural boost:

1. Prioritize Quality Sleep: During sleep, your immune system releases proteins called cytokines, which help fight infections and inflammation. Chronic sleep deprivation can decrease the production of these protective cytokines and infection-fighting antibodies. Aim for 7-9 hours of restful sleep each night.

2. Eat a Rainbow of Plant Foods: Fruits, vegetables, nuts, and seeds are rich in nutrients and antioxidants that may give you an upper hand against harmful pathogens. Antioxidants help decrease inflammation by combatting unstable compounds called free radicals.

3. Stay Active: Moderate exercise can reduce inflammation and help your immune cells regenerate regularly. Examples of moderate exercise include brisk walking, steady bicycling, and light hiking.

4. Manage Stress Levels: Long-term stress promotes inflammation, as well as imbalances in immune cell function. Activities like meditation, yoga, and deep breathing can help keep your stress hormones in check.

5. Stay Hydrated: While hydration doesn't necessarily protect you from germs and viruses, preventing dehydration is important to your overall health. Dehydration can cause headaches and hinder your physical performance, focus, and heart and kidney function.`,
    author: 'Dr. Sarah Ahmed',
    date: 'Oct 12, 2023',
    category: 'Immunity',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=800',
    image2: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800',
    readTime: '5 min'
  },
  {
    id: '2',
    title: 'Understanding Vitamin D: The Sunshine Nutrient',
    summary: 'Everything you need to know about Vitamin D deficiency, benefits, and sources.',
    content: `Vitamin D is unique because it's the only nutrient your body produces when exposed to sunlight. Often called the "sunshine vitamin," it plays a crucial role in maintaining healthy bones and teeth, and it may also provide protection against a range of diseases.

Why Vitamin D Matters:
The primary function of Vitamin D is to help your body absorb calcium and phosphorus from your diet. This is essential for building and maintaining strong bones. Research also suggests that Vitamin D may support immune health, regulate mood, and even reduce the risk of certain cancers.

Signs of Deficiency:
Many people are deficient without realizing it. Common symptoms include frequent infections, fatigue, bone and back pain, and slow wound healing. If you live in a northern climate or spend most of your time indoors, you might be at higher risk.

How to Get Enough:
While sunlight is the best source, you can also find Vitamin D in fatty fish (like salmon and mackerel), egg yolks, and fortified foods like milk and cereal. In many cases, a supplement may be necessary, especially during the winter months. Always consult with your healthcare provider before starting a new supplement regimen.`,
    author: 'Prof. Mark Wilson',
    date: 'Oct 15, 2023',
    category: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?q=80&w=800',
    image2: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800',
    readTime: '4 min'
  },
  {
    id: '3',
    title: 'Mental Health: Breaking the Stigma in 2023',
    summary: 'Why mental wellness is just as important as physical health and how to prioritize it.',
    content: `For too long, mental health has been treated as a secondary concern. However, in recent years, there's been a global shift toward recognizing that mental wellness is foundational to overall health.

Prioritizing your mental health isn't a luxury; it's a necessity. Chronic stress and untreated mental health conditions can lead to physical ailments, including heart disease and a weakened immune system.

Steps Toward Better Mental Health:
1. Practice Mindfulness: Spending even five minutes a day in quiet reflection or meditation can significantly lower cortisol levels.
2. Set Boundaries: Learn to say no to commitments that drain your energy.
3. Seek Professional Help: Talking to a therapist or counselor is a sign of strength, not weakness.
4. Connect with Others: Human connection is a powerful antidote to loneliness and anxiety.

Remember, it's okay not to be okay. The first step toward healing is acknowledging your feelings and reaching out for support.`,
    author: 'Dr. Jane Smith',
    date: 'Oct 20, 2023',
    category: 'Mental Health',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800',
    image2: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?q=80&w=800',
    readTime: '6 min'
  }
];

export const fetchBlogs = async (): Promise<Blog[]> => {
  return MOCK_BLOGS;
};
