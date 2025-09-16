export default defineNuxtRouteMiddleware(async (to, from) => {
  // const supabase = useSupabaseClient();
  const { id, sharingKey } = to.params;
  const quiz = useQuiz();
  const participant = useParticipant();
  participant.reset();
  const now = new Date();
  const log = console.log;

  if (!id || !sharingKey) return navigateTo("/error");

  // const { data, error } = await supabase
  //   .from("quizes")
  //   .select()
  //   .eq("id", id)
  //   .eq("sharing_key", sharingKey)
  //   .single();
  // if (error || !data) return navigateTo("/error");
  // else quiz.set(data);
  // if (quiz.deadLine) {
  //   const deadline = new Date(quiz.deadLine);
  //   if (deadline < now) return navigateTo("/expired");
  // }
});
