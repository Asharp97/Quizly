import { defineStore } from "pinia";

export const useAnswers = defineStore("answers", () => {
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
    return []; //todo
  };

  const remove = (n: number) => {
    list.value.splice(n, 1);
  };

  const del = async (x: number, n: number) => {
    return true; //todo
  };

  const cleanup = async () => {
    return true; //todo
  };

  const post = async () => {
    return true; //todo
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
