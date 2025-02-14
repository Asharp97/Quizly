export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient();
  const { id } = to.params;
  const participant = useParticipant();
  // participant.reset();

  if (!id || !participant.id) {
    return navigateTo("/error");
  }

  const { data, error } = await supabase
    .from("quizes")
    .select("show_result")
    .eq("id", id)
    .single();
  if (!data?.show_result) {
    console.log(2);
    return navigateTo("/error");
  }
  if (await !participant.hasTakenQuiz()) {
    console.log(3);
    return navigateTo("/error");
  }
});
