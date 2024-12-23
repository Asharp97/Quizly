import { defineStore } from "pinia";

export const useAnswers = defineStore("answers", () => {
  const supabase = useSupabaseClient();
  const question = useQuestion();

  const list = ref([
    {
      text: "",
      is_correct: false,
    },
    {
      text: "",
      is_correct: false,
    },
    {
      text: "",
      is_correct: false,
    },
  ]);

  const set = (x: any) => {
    list.value = x;
  };

  const tf = ref({
    is_correct: false,
  });
  const oe = ref({
    text: "",
  });

  const reset = () => {
    list.value = [
      {
        text: "",
        is_correct: false,
      },
      {
        text: "",
        is_correct: false,
      },
      {
        text: "",
        is_correct: false,
      },
    ];
  };

  const get = async (x: number) => {
    const { data, error } = await supabase
      .from("answers")
      .select()
      .eq("question_id", x);
    if (data) {
      if (question.type == "mcq")
        if (data.length > 1) {
          set(data);
          return data;
        } else reset();
      if (question.type == "tf") {
        tf.value = data[0];
        return data[0];
      }
    } else console.log(error);
  };

  const remove = (n: number) => {
    list.value.splice(n, 1);
  };

  const del = async (x: number, n: number) => {
    if (list.value[n].id) await supabase.from("answers").delete().eq("id", x);
    remove(n);
  };

  const cleanup = async () => {
    const query = supabase
      .from("answers")
      .delete()
      .eq("question_id", question.id);
    if (question.type === "tf") await query.not("text", "is", null);
    if (question.type === "mcq") await query.is("text", null);
  };

  const post = async () => {
    let query = supabase.from("answers");
    if (question.type == "mcq") {
      list.value = list.value.map((answer) => ({
        ...answer,
        question_id: question.id,
      }));

      for (let i = 0; i < list.value.length; i++) {
        const { error } = await query.upsert(list.value[i]);
        if (error) console.log(error);
      }
    }
    if (question.type == "tf") {
      tf.value.question_id = question.id;
      const { data, error } = await query.upsert(tf.value).select();
      if (error) console.log(error);
    }
    if (question.type == "oe") {
      oe.value.question_id = question.id;
      console.log(oe.value);
      const { data, error } = await query.upsert(oe.value).select();
      if (error) console.log(error);
    }
  };

  return {
    list,
    tf,
    oe,
    reset,
    cleanup,
    del,
    get,
    post,
  };
});
