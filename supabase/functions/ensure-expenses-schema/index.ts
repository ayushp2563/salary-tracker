import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL DEFAULT 'other',
  payment_source TEXT NOT NULL DEFAULT 'bank' CHECK (payment_source IN ('tips', 'bank')),
  currency TEXT NOT NULL DEFAULT 'USD',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON public.expenses(user_id);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const dbUrl = Deno.env.get("SUPABASE_DB_URL") || Deno.env.get("DATABASE_URL");

    // Prefer direct SQL when DB URL is configured in function secrets
    if (dbUrl) {
      const { default: postgres } = await import("https://deno.land/x/postgres@v0.17.0/mod.ts");
      const client = new postgres.Client(dbUrl);
      await client.connect();
      await client.queryObject(MIGRATION_SQL);
      await client.end();
      return new Response(JSON.stringify({ ok: true, mode: "db_url" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Probe whether expenses already exists using service role
    const admin = createClient(supabaseUrl, serviceKey);
    const { error } = await admin.from("expenses").select("id").limit(1);
    if (!error) {
      return new Response(JSON.stringify({ ok: true, mode: "already_exists" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        ok: false,
        error: "expenses table missing and SUPABASE_DB_URL not set",
        hint: "Run supabase/migrations/20260712180000_expenses_backend_idempotent.sql in the SQL editor",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
