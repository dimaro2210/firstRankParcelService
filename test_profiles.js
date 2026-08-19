import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkhccivrxuqsnyizrptq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraGNjaXZyeHVxc255aXpycHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMjE5ODAsImV4cCI6MjA5NTc5Nzk4MH0.Coh832CYQcnX5l_vVfirjiWK8EYzJwXvvGlv4QoZP8A';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log("Data:", data);
  console.log("Error:", error);
}

testQuery();
