import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xvfzjuzdjyhktooxlotc.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZnpqdXpkanloa3Rvb3hsb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQyMTAzMzgsImV4cCI6MTk5OTc4NjMzOH0.AvcpkkwEJxa2rSZ9B94sEJGLFlj0kOZV4W3jLdmAFNw";
export const supabase = createClient(supabaseUrl, supabaseKey);
