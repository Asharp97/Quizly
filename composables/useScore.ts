import { defineStore } from "pinia";
import { nanoid } from "nanoid";

export const useScore = defineStore("score", () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const modal = useModal();
  const question = useQuestion();
  const participant = useParticipant();
  const log = console.log;

  const id = ref();
  const list = ref([]);
  const scores = ref();
  const submissions = ref([]);

  function reset() {
    id.value = null;
    list.value = [];
    scores.value = null;
    submissions.value = [];
  }

  function set(x: any) {
    id.value = x?.id;
    scores.value = x?.score;
  }

  const get = async (x?: number, y?: number) => {
    console.log("question_id: ", x, "participant_id: ", y);
    if (x && y) {
      const { data, error } = await supabase
        .from("scores")
        .select()
        .eq("question_id", x)
        .eq("participant_id", y)
        .single();
      if (data) {
        return data;
      } else log(error);
    }
  };

  const mostMissed = async (quizId: number) => {
    const { data, error } = await supabase.rpc("get_most_missed", {
      p_quiz_id: quizId,
    });
    if (error) {
      console.error("Error:", error.message);
    } else return data;
  };

  const post = async (x: Array<number>) => {
    const { data, error } = await supabase
      .from("scores")
      .insert(x)
      .select()
      .single();
    if (error) log(error);
    else await get();
  };

  return {
    id,
    scores,
    submissions,
    list,
    mostMissed,
    reset,
    get,
    post,
  };
});
