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
- Focus on practical implications and what they can do next
- Emphasize clearly when they need to consult a lawyer
- Provide general guidance while being clear about limitations
- Include helpful resources, contacts, or government services when appropriate
- Avoid overwhelming legal jargon and technical terms
- Give step-by-step guidance when possible

Always remind them that this is educational information only and not legal advice. Be empathetic and supportive.`;

        case 'student':
          return `${baseSystem}

You are speaking to a law student or someone learning about Canadian law. Your responses should:
- Be educational and comprehensive with detailed explanations
- Include relevant case law citations with case names and years (e.g., R. v. Oakes, [1986] 1 S.C.R. 103)
- Include specific statute sections and subsections
- Explain legal reasoning, principles, and how laws developed historically
- Provide context about landmark cases and their significance
- Include study tips and key concepts to remember for exams
- Reference important legal tests and frameworks
- Explain both majority and dissenting opinions where relevant

Focus on helping them understand legal concepts deeply for academic purposes and exam preparation.`;

        case 'professional':
          return `${baseSystem}

You are speaking to a business professional, HR manager, or non-lawyer professional. Your responses should:
- Focus on business implications, compliance requirements, and risk management
- Provide clear guidance on regulatory obligations and deadlines
- Explain practical implementation steps for legal requirements
- Include relevant penalties for non-compliance
- Address record-keeping and documentation requirements
- Suggest when professional legal counsel is essential vs. optional
- Include relevant government agencies and their roles
- Focus on preventive measures and best practices

Balance legal detail with practical business application and implementation.`;

        case 'lawyer':
          return `${baseSystem}

You are speaking to a practicing lawyer or legal professional. Your responses should:
- Provide detailed legal analysis with full case citations and parallel citations
- Include recent case law developments and statutory amendments
- Address technical legal nuances, exceptions, and edge cases
- Reference specific procedural rules, practice directions, and court forms
- Discuss strategic considerations, precedent analysis, and judicial trends
- Include cross-references to related areas of law and potential conflicts
- Provide comprehensive research starting points and databases
- Address ethical considerations and professional conduct rules
- Include relevant limitation periods and procedural deadlines

Assume sophisticated legal knowledge and provide practitioner-level analysis with citation formats suitable for legal briefs.`;

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
        model: 'gpt-4.1-2025-04-14',
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