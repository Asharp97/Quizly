// import { useSupabaseClient } from "../node_modules/.pnpm/@nuxtjs+supabase@1.4.2/node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { defineStore } from "pinia";

export const useQuiz = defineStore("quiz", () => {
  const id = ref();
  const name = ref("");
  const menu = ref(null);
  const sharingKey = ref(null);

  const user = ref();
  const responses = ref();

  function reset() {
    id.value = null;
    name.value = "";
    menu.value = null;
    sharingKey.value = null;
  }
  function set(x: any) {
    id.value = x.id;
    name.value = x.title;
    user.value = x.user_id;
    sharingKey.value = x.sharing_key;
    responses.value = x.responses;
  }

  return { id, name, menu, sharingKey, reset, set };
});
