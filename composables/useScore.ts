import { defineStore } from "pinia";

export const useScore = defineStore("score", () => {
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
    return true; //todo
  };

  const getCorrectCount = async () => {
    return true; //todo
  };

  const getTotaltCount = async () => {
    return true; //todo
  };

  const post = async (x: Array<number>) => {
    return true; //todo
  };

  return {
    id,
    scores,
    submissions,
    list,
    reset,
    get,
    post,
    getCorrectCount,
    getTotaltCount,
  };
});
