import { defineStore } from "pinia";

export const useQuestion = defineStore("question", () => {
  const modal = useModal();
  const quiz = useQuiz();

  const id = ref(null);
  const name = ref("");
  const type = ref("mcq");

  const list = ref([]);
  const amount = ref();

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
    return true; //todo
  };

  const getCount = async (x?: number) => {
    return true; //todo
  };

  const post = async () => {
    return true; //todo
  };

  const update = async () => {
    return true; //todo
  };

  const del = async (x: number) => {
    return true; //todo
  };

  return {
    id,
    name,
    menu,
    type,
    list,
    amount,
    reset,
    set,
    get,
    getCount,
    post,
    update,
    del,
  };
});
