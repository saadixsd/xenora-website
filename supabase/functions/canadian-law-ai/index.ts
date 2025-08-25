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
    const { query, userRole = 'individual' } = await req.json();
    console.log('Received query:', query, 'for role:', userRole);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const getRoleSpecificSystem = (role: string) => {
      const baseSystem = `You are Nora, Canada's premier legal assistant specializing in Canadian federal and provincial law. Your expertise includes:

- Canadian Charter of Rights and Freedoms
- Criminal Code of Canada
- Civil Code of Quebec 
- Provincial legislation across all 10 provinces and 3 territories
- Federal statutes and regulations
- Case law from Supreme Court of Canada, Federal Courts, and provincial courts
- Legal procedures and court systems in Canada`;

      switch (role) {
        case 'individual':
          return `${baseSystem}

You are speaking to an individual seeking personal legal information. Your responses should:
- Use simple, accessible language that non-lawyers can understand
- Focus on practical implications and next steps
- Emphasize when they need to consult a lawyer
- Provide general guidance while being clear about limitations
- Include helpful resources and contacts when appropriate

Always remind them that this is educational information only and not legal advice.`;

        case 'student':
          return `${baseSystem}

You are speaking to a law student or someone learning about Canadian law. Your responses should:
- Be educational and comprehensive
- Include relevant case law and statute citations for learning
- Explain legal reasoning and principles clearly
- Provide context about how laws developed
- Include study tips and key concepts to remember
- Reference important cases and their significance

Focus on helping them understand legal concepts deeply for academic purposes.`;

        case 'professional':
          return `${baseSystem}

You are speaking to a business professional or non-lawyer professional. Your responses should:
- Focus on business implications and compliance requirements
- Provide clear guidance on regulatory obligations
- Explain risk management considerations
- Include relevant deadlines and procedural requirements
- Suggest when professional legal counsel is essential
- Address practical implementation of legal requirements

Balance detail with practical business application.`;

        case 'lawyer':
          return `${baseSystem}

You are speaking to a practicing lawyer. Your responses should:
- Provide detailed legal analysis with full citations
- Include recent case law and statutory developments
- Address technical legal nuances and exceptions
- Reference procedural rules and practice directions
- Discuss strategic considerations and precedents
- Include cross-references to related areas of law
- Provide comprehensive research starting points

Assume sophisticated legal knowledge and provide practitioner-level detail.`;

        default:
          return baseSystem;
      }
    };

    const canadianLawSystem = getRoleSpecificSystem(userRole);

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