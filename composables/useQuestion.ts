// import { useSupabaseClient } from "../node_modules/.pnpm/@nuxtjs+supabase@1.4.2/node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { defineStore } from "pinia";

export const useQuestion = defineStore("question", () => {
  const supabase = useSupabaseClient();
  const modal = useModal();
  const quiz = useQuiz();

  const id = ref(null);
  const name = ref("");
  const type = ref("mcq");

  const list = ref([]);

  const menu = ref(null);

  function reset() {
    id.value = null;
    name.value = "";
    type.value = "mcq";

    menu.value = null;
  }

  function set(x: any) {
    id.value = x?.id;
    name.value = x?.text;
    type.value = x?.type;
  }

  const get = async (x?: number) => {
    if (x) {
      const { data, error } = await supabase
        .from("questions")
        .select()
        .order("created_at", { ascending: false })
        .eq("quiz_id", x);
      if (data) {
        list.value = data;
      } else console.log(error);
    }
  };

  const post = async () => {
    if (!quiz.id) {
      quiz.name = "Quiz #" + (quiz.list.length + 1);
      await quiz.post();
    }
    const { data, error } = await supabase
      .from("questions")
      .insert({
        text: name.value,
        quiz_id: quiz.id,
        type: type.value,
      })
      .select()
      .single();
    if (error) console.log(error);
    else {
      set(data);
      modal.close();
      get(quiz.id);
    }
  };

  const update = async () => {
    const { data, error } = await supabase
      .from("questions")
      .upsert({
        id: id.value,
        text: name.value,
        quiz_id: quiz.id,
        type: type.value,
      })
      .select()
      .single();
    if (error) console.log(error);
    else {
      set(data);
      modal.close();
      get(quiz.id);
    }
  };

  const del = async (x: number) => {
    const response = await supabase.from("questions").delete().eq("id", x);
    if (response.status == 204) get(quiz.id);
  };

  return {
    id,
    name,
    menu,
    type,
    list,
    reset,
    set,
    get,
    post,
    update,
    del,
  };
});
