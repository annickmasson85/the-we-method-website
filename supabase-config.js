const SUPABASE_URL = "https://nhlutehurikvytklvtlm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mIoW_wJMYtvNQbdkyGyDqQ_4wUZ-c9c";

window.supabaseClient = null;

if (window.supabase && typeof window.supabase.createClient === "function") {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
} else {
  console.error("Supabase library missing. Check the script order.");
}