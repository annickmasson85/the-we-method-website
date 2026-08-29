const SUPABASE_URL = "https://nhlutehurikvytklvtlm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mIoW_wJMYtvNQbdkyGyDqQ_4wUZ-c9c";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);