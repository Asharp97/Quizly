// Nuxt route middleware to verify quiz existence using sharing key
export default defineNuxtRouteMiddleware(async (to, from) => {
  const Quiz = useQuiz(); // Quiz composable for API calls

  try {
    // Get sharing key from route params and verify quiz
    const link = from.params.sharingKey;
    const quizExists = await Quiz.verifyQuiz(link as string);
  } catch (err) {
    // If verification fails, redirect to expired page
    console.error("Middleware error:", err);
    return navigateTo("/expired", { replace: true });
  }
});
