import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Received query:', query);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const canadianLawSystem = `You are Nora, Canada's premier AI legal assistant specializing in Canadian federal and provincial law. Your expertise includes:

- Canadian Charter of Rights and Freedoms
- Criminal Code of Canada
- Civil Code of Quebec 
- Provincial legislation across all 10 provinces and 3 territories
- Federal statutes and regulations
- Case law from Supreme Court of Canada, Federal Courts, and provincial courts
- Legal procedures and court systems in Canada

Your responses should:
1. Be accurate and cite relevant Canadian statutes, regulations, or case law
2. Distinguish between federal and provincial jurisdiction where applicable
3. Provide practical legal guidance while noting when professional legal advice is needed
4. Use plain language to explain complex legal concepts
5. Include relevant section numbers and case citations when possible

Always remind users that your information is for educational purposes and does not constitute legal advice. For specific legal matters, they should consult with a qualified Canadian lawyer.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: canadianLawSystem },
          { role: 'user', content: query }
        ],
        max_tokens: 1500,
        temperature: 0.3,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in canadian-law-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});