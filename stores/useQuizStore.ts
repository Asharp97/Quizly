// Pinia store for managing quiz and participant state
export const useQuizStore = defineStore("quiz", () => {
  // Stores the current quiz object
  const quiz = ref({} as Quiz);
  // Stores the current participant (user) object
  const participant = ref({} as user);

  // Expose quiz and participant state
  return {
    quiz,
    participant,
  };
});
