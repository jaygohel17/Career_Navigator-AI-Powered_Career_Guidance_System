import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const timestamp = new Date().toISOString();
    
    const systemPrompt = `You are an expert psychometrician creating IQ test questions that assess critical thinking, logical reasoning, pattern recognition, and problem-solving abilities. 

Generate exactly 10 UNIQUE multiple-choice questions that test:
- Logical reasoning (e.g., deductive logic, if-then statements, syllogisms)
- Pattern recognition (e.g., number sequences, visual patterns, analogies)
- Spatial reasoning (e.g., mental rotation, shape manipulation)
- Mathematical logic (e.g., problem-solving, quantitative reasoning)
- Verbal reasoning (e.g., word relationships, comprehension)

IMPORTANT: Create completely NEW and ORIGINAL questions for timestamp ${timestamp}. Do not repeat common or standard IQ test questions. Be creative and vary question types, difficulty, and topics.

Each question must have:
- 4 distinct options with only one correct answer
- Varying difficulty from medium to challenging
- Clear, unambiguous wording
- A logical explanation for the correct answer`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nGenerate an IQ test with 10 critical thinking questions.`
          }]
        }],
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" }
                    },
                    correct_answer: { type: "integer" },
                    explanation: { type: "string" }
                  },
                  required: ["question", "options", "correct_answer", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error("No content in response");
    }

    const testData = JSON.parse(content);

    return new Response(JSON.stringify(testData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-iq-test:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});