import { defineStore } from "pinia";

export const useParticipant = defineStore(
  "participant",
  () => {
    const supabase = useSupabaseClient();
    const question = useQuestion();
    const quiz = useQuiz();
    const answer = useAnswers();

    const id = ref(null);

    const list = ref([]);

    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const emailError = ref("");
    const credStore = ref(false);
    const correctCount = ref(0);
    const timeSpent = ref(null);
    const score = ref(null);

    const resetError = () => {
      emailError.value = "";
    };
    const hasTakenQuiz = async () => {
      const { data, error } = await supabase
        .from("participants")
        .select()
        .eq("quiz_id", quiz.id)
        .eq("email", email.value);
      if (data?.length) {
        emailError.value = "Seems like you already took this quiz dude";
        return false;
      } else {
        resetError();
        return true;
      }
    };

    function reset() {
      id.value = null;
      credStore.value = false;
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      emailError.value = "";
      correctCount.value = 0;
      timeSpent.value = null;
      score.value = null;
    }

    function set(x: any) {
      id.value = x.id;
    }

    const incrementResponses = async () => {
      const { error } = await supabase.rpc("increment", { row_id: quiz.id });
      if (error) console.log(error);
    };

    const getCount = async (x: number) => {
      if (x) {
        const { count, error } = await supabase
          .from("participants")
          .select("*", { count: "exact", head: true })
          .eq("quiz_id", x);
        if (count) return count;
        if (error) console.log(error);
      }
    };

    const post = async () => {
      const { data, error } = await supabase
        .from("participants")
        .insert({
          name: firstName.value.concat(" ", lastName.value),
          email: email.value,
          correct_count: correctCount.value,
          time_spent: timeSpent.value,
          score: score.value,
          quiz_id: quiz.id,
        })
        .select()
        .single();
      if (data) {
        set(data);
        await question.get(quiz.id);
        question.set(question.list[0]);
        await answer.get(question.id);
      }
      if (error) console.log(error);
    };
    const getLimited = async (x: number) => {
      if (x) {
        const { data, error } = supabase
          .from("participants")
          .select()
          .eq("quiz_id", x)
          .limit(3);
        if (data) {
          list.value = data;
          console.log(data);
        }
        if (error) console.log(error);
      }
    };
    const get = async (x: number) => {
      if (x) {
        const { data, error } = await supabase
          .from("participants")
          .select()
          .eq("quiz_id", x);
        if (data) list.value = data;
        if (error) console.log(error);
      }
    };

    const getScores = async (x: number) => {
      if (x) {
        const { data, error } = await supabase
          .from("participants")
          .select("score")
          .eq("quiz_id", x);

        if (data) return data;
        if (error) console.log(error);
      }
    };

    return {
      id,
      firstName,
      lastName,
      email,
      emailError,
      credStore,
      correctCount,
      timeSpent,
      score,

      list,

      set,
      reset,
      get,
      getLimited,
      getScores,
      incrementResponses,
      getCount,
      hasTakenQuiz,
      post,
    };
  },
  {
    persist: true,
  }
);
