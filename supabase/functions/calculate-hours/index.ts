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
    const { employmentType, employmentStatus, netPay, startDate, endDate } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Calculating hours for:', { employmentType, employmentStatus, netPay, startDate, endDate });

    const systemPrompt = `You are an expert in Ontario, Canada employment law and payroll calculations. You help calculate the number of hours worked based on the net pay (after-tax amount) an employee receives.

Key Information:
1. Ontario Minimum Wage (October 2025): $17.60/hour (before taxes)
2. VacPay: 4% of gross earnings is typically included in gross salary
3. Typical Tax Deductions in Ontario:
   - CPP (Canada Pension Plan): ~5.95% of gross earnings
   - EI (Employment Insurance): ~1.58% of gross earnings
   - Federal Income Tax: Progressive rates
   - Ontario Provincial Tax: Progressive rates
   - Total deductions typically range from 20-30% for average earners

4. Ontario Public Holidays:
   - New Year's Day, Family Day, Good Friday, Victoria Day, Canada Day, Labour Day, Thanksgiving, Christmas Day, Boxing Day

Your Task:
Calculate the approximate hours worked by working backwards from the net pay (after-tax amount) the employee received in their bank account.

IMPORTANT FORMATTING RULES:
- Do NOT use asterisks, bullet points, or markdown symbols
- Use simple numbered lists
- Use clear headings without special characters
- Keep explanations simple and easy to understand
- Format currency clearly with dollar signs`;

    const userPrompt = `Calculate hours worked for an employee who received $${netPay} in their bank account (net pay after all taxes and deductions) for the bi-weekly period from ${startDate} to ${endDate}.

Employment Details:
- Employment Type: ${employmentType}
- Employment Status: ${employmentStatus}
- Hourly Rate: $17.60/hour (before taxes)

Please provide a clear breakdown:
1. Show the calculation working backwards from net pay to gross pay
2. Estimate total hours worked
3. Check if any Ontario public holidays fall in this period
4. Explain the calculation in simple terms

Remember: Use simple formatting without asterisks or special symbols. Keep the explanation clear and easy to read.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const calculation = data.choices[0].message.content;

    console.log('Calculation result:', calculation);

    return new Response(
      JSON.stringify({ calculation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in calculate-hours function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
