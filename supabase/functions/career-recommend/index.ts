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
    const { profileData } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const systemPrompt = `You are a career guidance expert AI. Analyze the user's profile and recommend the top 3 most suitable career options based on their qualifications, skills, interests, and work style. 

For each career, provide:
1. Career title
2. Confidence score (1-100)
3. Brief description (2-3 sentences)
4. Required skills (list of key skills needed)

Consider:
- Educational background and qualifications
- Current skill set
- Personal interests and passions
- Preferred work style
- Market demand and growth potential

Return exactly 3 career recommendations ranked by suitability.`;

    const userPrompt = `Profile:
- Qualification: ${profileData.qualification}
- Education: ${profileData.education_background}
- Skills: ${profileData.skills?.join(', ') || 'Not specified'}
- Interests: ${profileData.interests?.join(', ') || 'Not specified'}
- Work Style: ${profileData.work_style || 'Not specified'}
- Age: ${profileData.age || 'Not specified'}

Provide your top 3 career recommendations.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              careers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    confidence_score: { type: 'number' },
                    description: { type: 'string' },
                    required_skills: { 
                      type: 'array',
                      items: { type: 'string' }
                    }
                  },
                  required: ['title', 'confidence_score', 'description', 'required_skills']
                }
              }
            },
            required: ['careers']
          }
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data));

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No content in response');
    }

    const { careers } = JSON.parse(content);

    return new Response(JSON.stringify({ careers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in career-recommend function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
