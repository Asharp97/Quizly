import { defineStore } from "pinia";

export const useParticipant = defineStore(
  "participant",
  () => {
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
      return true; //todo
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
      return true; //todo
    };

    const getCount = async (x: number) => {
      return true; //todo
    };

    const post = async () => {
      return true; //todo
    };
    const getLimited = async (x: number) => {
      return true; //todo
    };
    const get = async (x: number) => {
      return true; //todo
    };

    const getScores = async (x: number) => {
      return true; //todo
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
  },
);
