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
    const { employmentType, employmentStatus, grossSalary, startDate, endDate } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Calculating hours for:', { employmentType, employmentStatus, grossSalary, startDate, endDate });

    // Build comprehensive prompt with Ontario employment laws and tax considerations
    const systemPrompt = `You are an expert in Ontario, Canada employment law and payroll calculations. You help calculate the number of hours worked based on bi-weekly gross salary.

Key Ontario Employment Considerations:
1. Minimum Wage (2024): $16.55/hour general, $15.60/hour for students under 18 working <28 hours/week
2. VacPay: 4% of gross earnings is included in the gross salary
3. Taxes and Deductions:
   - CPP (Canada Pension Plan) Employee: 5.95% on earnings above $3,500 annually
   - EI (Employment Insurance) Employee: 1.58% on earnings up to $63,200 annually
   - Federal Income Tax: Progressive rates based on annual income brackets
   - Ontario Provincial Tax: Progressive rates
4. Stat Pay: Ontario has 9 public holidays. If worked, employees get 1.5x pay or premium pay plus day off
5. Full-time vs Part-time: Different benefit considerations but same minimum wage
6. Student vs Working Professional: Students under 18 may have different minimum wage

Calculate the approximate hours worked considering:
- The gross salary includes VacPay (4%)
- Deductions reduce take-home but don't affect hours calculation
- Check if the bi-week period includes any Ontario public holidays
- Consider the employment type and status for wage rates

Ontario Public Holidays:
- New Year's Day (Jan 1)
- Family Day (3rd Monday in Feb)
- Good Friday
- Victoria Day (Monday before May 25)
- Canada Day (July 1)
- Labour Day (1st Monday in Sept)
- Thanksgiving (2nd Monday in Oct)
- Christmas Day (Dec 25)
- Boxing Day (Dec 26)

Provide a detailed breakdown showing:
1. Estimated hourly rate
2. Estimated hours worked
3. Consideration of VacPay
4. Whether any stat holidays fall in the period
5. Brief explanation of calculations`;

    const userPrompt = `Calculate hours worked for:
- Employment Type: ${employmentType}
- Employment Status: ${employmentStatus}
- Bi-weekly Gross Salary: $${grossSalary}
- Period: ${startDate} to ${endDate}

Provide:
1. Estimated hourly wage rate
2. Total hours worked (considering VacPay is included in gross)
3. Breakdown of calculation
4. Any stat holiday considerations for this period`;

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
