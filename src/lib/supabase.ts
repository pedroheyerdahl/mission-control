import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ksicpzbpkwzystnrwpzd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaWNwemJwa3d6eXN0bnJ3cHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Njk0OTksImV4cCI6MjA4NzU0NTQ5OX0.kZLLY8Xc_x_tlLQrjMmwgSR1AHAKuxxqCiH0MHV46H4';

export const supabase = createClient(supabaseUrl, supabaseKey);
