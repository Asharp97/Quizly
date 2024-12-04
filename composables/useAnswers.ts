import { defineStore } from "pinia";

export const useAnswers = defineStore("answers", () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const modal = useModal();
  const db = supabase.from("answers");

  const answers = ref([
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
  const addAnswer = () => {};
  const resetAnswer = () => {
    answers.value = [
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
  const getAnswer = async (questionId: number, type: string) => {
    const { data, error } = await supabase
      .from("answers")
      .select()
      .eq("question_id", questionId);
    if (data) {
      if (type == "mcq")
        if (data.length >= 2) answers.value = data;
        else answersReset();
      else if (type == "tf") if (data.length == 1) tf.value = data[0];
    } else console.log(error);
  };

  return { answers, resetAnswer, getAnswer, postAnswer };
});
