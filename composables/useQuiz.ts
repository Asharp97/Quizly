import { useSupabaseClient } from "../node_modules/.pnpm/@nuxtjs+supabase@1.4.2/node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";

export const useQuiz = () => {
  const supabase = useSupabaseClient();
  const session = useSession();

  // Reactive variables
  const quizes = ref([]);
  const activeQuiz = ref();
  const quizName = ref("");
  const loading = ref(false);
  const noContent = ref(false);

  const modal = useModal(); // Assuming `useModal` is globally available
  const quizMenu = ref(null);
  const quizMenuRef = ref(null);
  const quizModalInput = ref(null);

  // Clear inputs
  const clearInputs = () => (quizName.value = "");

  // Fetch all quizzes
  const getQuizes = async () => {
    try {
      loading.value = true;
      const { data, error } = await supabase.from("quizes").select();
      if (data) {
        quizes.value = data;
        activeQuiz.value = quizes.value[0]?.id || null;
        noContent.value = quizes.value.length === 0;
      } else throw error;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  // Fetch a single quiz by ID
  const getQuiz = async (x: number) => {
    const { data, error } = await supabase.from("quizes").select().eq("id", x);
    if (data?.[0]) quizName.value = data[0].title;
    else console.error(error);
  };

  // Show modal to add a new quiz
  const handlPostQuiz = async () => {
    quizName.value = `Quiz #${quizes.value.length + 1}`;
    modal.show = "postQuiz";
    await nextTick();
    quizModalInput.value.focus();
  };

  // Add a new quiz
  const postQuiz = async () => {
    const { error } = await supabase.from("quizes").insert({
      title: quizName.value,
      user_id: session.user.id,
    });
    if (error) console.error(error);
    else {
      await getQuizes();
      modal.close();
      quizName.value = "";
    }
  };

  // Delete a quiz
  const deleteQuiz = async (x: number) => {
    const response = await supabase.from("quizes").delete().eq("id", x);
    if (response.status === 204) {
      await getQuizes();
      modal.close();
    }
  };

  // Show modal to edit a quiz
  const handlequizEditor = async (x: number) => {
    await getQuiz(x);
    modal.show = "editQuiz";
    await nextTick();
    quizModalInput.value.focus();
  };

  // Edit an existing quiz
  const editQuiz = async () => {
    const { error } = await supabase
      .from("quizes")
      .update({ title: quizName.value })
      .eq("id", activeQuiz.value);
    if (error) console.error(error);
    else {
      await getQuizes();
      modal.close();
      quizName.value = "";
    }
  };

  return {
    quizes,
    activeQuiz,
    quizName,
    loading,
    noContent,
    quizMenu,
    quizMenuRef,
    quizModalInput,
    clearInputs,
    getQuizes,
    getQuiz,
    handlPostQuiz,
    postQuiz,
    deleteQuiz,
    handlequizEditor,
    editQuiz,
  };
};
