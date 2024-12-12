export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient();
  const { id } = to.params;
  const participant = useParticipant();
  participant.reset();

  if (!id || participant.id) return navigateTo("/error");

  const { data, error } = await supabase
    .from("quizes")
    .select("show_result")
    .eq("id", id)
  if (!data[0].show_result) return navigateTo("/error");

  if (await !participant.hasTakenQuiz()) return navigateTo("/error");
});
