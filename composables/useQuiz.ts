import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useQuiz = () => {
  const hello = () => console.log("example Composable");
  return {
    hello,
  };
};
