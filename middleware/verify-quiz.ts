export default defineNuxtRouteMiddleware(async (to, from) => {
  const Quiz = useQuiz();

  try {
    const link = from.params.sharingKey;
    const quizExists = await Quiz.verifyQuiz(link as string);
  } catch (err) {
    console.error("Middleware error:", err);
    return navigateTo("/expired", { replace: true });
  }
});
