export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient();
  const { id, sharingKey } = to.params;
  const quiz = useQuiz();
  const participant = useParticipant();
  participant.reset();

  if (!id || !sharingKey) return navigateTo("/error");

  const { data, error } = await supabase
    .from("quizes")
    .select()
    .eq("sharing_key", sharingKey)
    .single();

  if (error || !data) return navigateTo("/error");

  quiz.set(data);
});
