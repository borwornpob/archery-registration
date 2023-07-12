import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://okwjakwdaasaokbbobhd.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rd2pha3dkYWFzYW9rYmJvYmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxNTk1MDEsImV4cCI6MjAwNDczNTUwMX0.VCBMrSbiMAMPXKrxheE3PEn6J7534SpP9LLsbLxlogY";
export const supabase = createClient(supabaseUrl, supabaseKey);
