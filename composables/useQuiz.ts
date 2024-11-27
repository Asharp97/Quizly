import { useSupabaseClient } from "../node_modules/.pnpm/@nuxtjs+supabase@1.4.2/node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { defineStore } from "pinia";

export const useQuiz = defineStore("quiz", () => {
  const id = ref();
  const name = ref("");
  const menu = ref(null);

  function reset() {
    id.value = null;
    name.value = "";
    menu.value = null;
  }

  return { id, name, menu, reset };
});
