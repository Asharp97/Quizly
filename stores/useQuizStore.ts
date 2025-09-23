export const useQuizStore = defineStore("quiz", () => {
  const quiz = ref({} as Quiz);
  const participant = ref({} as user);

  return {
    quiz,
    participant,
  };
});
