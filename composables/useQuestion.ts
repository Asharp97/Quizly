// import { useSupabaseClient } from "../node_modules/.pnpm/@nuxtjs+supabase@1.4.2/node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { defineStore } from "pinia";

export const useQuestion = defineStore("question", () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const modal = useModal();
  const db = supabase.from("questions");

  const id = ref(null);
  const name = ref("");
  const type = ref("mcq");
  const quizId = ref(null);

  const list = ref([]);

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

  const get = async (x?: number) => {
    if (x) {
      const { data, error } = await db
        .select()
        .order("created_at", { ascending: false })
        .eq("quiz_id", x);
      if (data) {
        list.value = data;
        if (data.length) {
          // answersReset();
          reset();
        }
      } else console.log(error);
    }
  };

  return { id, name, menu, type, quizId, list, reset, set };
});
