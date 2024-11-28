// import { useSupabaseClient } from "../node_modules/.pnpm/@nuxtjs+supabase@1.4.2/node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { defineStore } from "pinia";

export const useQuestion = defineStore("question", () => {
  const id = ref(null);
  const name = ref("");
  const type = ref("mcq");
  const quizId = ref(null);

  const menu = ref(null);

  function reset() {
    id.value = null;
    name.value = "";
    quizId.value = null;
    type.value = "mcq";

    menu.value = null;
  }

  function set(x: any) {
    id.value = x.id;
    name.value = x.text;
    quizId.value = x.quiz_id;
    type.value = x.type;
  }

  return { id, name, menu, type, quizId, reset, set };
});
