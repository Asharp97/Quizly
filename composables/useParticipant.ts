import { defineStore } from "pinia";

export const useParticipant = defineStore(
  "participant",
  () => {
    const supabase = useSupabaseClient();
    const question = useQuestion();
    const quiz = useQuiz();
    const answer = useAnswers();

    const id = ref(null);
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const emailError = ref("");
    const credStore = ref(false);
    const resetError = () => {
      emailError.value = "";
    };
    const hasTakenQuiz = async () => {
      const { data, error } = await supabase
        .from("participants")
        .select()
        .eq("quiz_id", quiz.id)
        .eq("email", email.value)
        .single();
      if (data) {
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
    }

    function set(x: any) {
      id.value = x.id;
    }

    const incrementResponses = async () => {
      const { error } = await supabase.rpc("increment", { row_id: quiz.id });
      if (error) console.log(error);
    };

    const postCredintials = async () => {
      const { data, error } = await supabase
        .from("participants")
        .insert({
          name: firstName.value.concat(" ", lastName.value),
          email: email.value,
          quiz_id: quiz.id,
        })
        .select();
      if (data) {
        set(data[0]);
        question.get(quiz.id);
        question.set(question.list[0]);
        answer.get();
      }
      if (error) console.log(error);
    };

    return {
      id,
      firstName,
      lastName,
      email,
      emailError,
      credStore,
      set,
      reset,
      incrementResponses,
      hasTakenQuiz,
      postCredintials,
    };
  },
  {
    persist: true,
  }
);
