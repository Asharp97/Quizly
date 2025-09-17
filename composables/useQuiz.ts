import type { QuizUncheckedCreateInput, QuizUpdateInput } from "#gql";

export const useQuiz = () => {
  const session = useSession();

  const get = async (x: string) => {
    const { data, error } = await useAsyncGql("GetQuiz", {
      id: x,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.GetQuiz;
  };

  const getAll = async () => {
    if (!session.user) {
      return navigateTo("/");
      throw new Error("No user in session");
    }
    const user_Id: string = session.user?.id;
    const { data, error } = await useAsyncGql("GetQuizzes", {
      where: { userId: { equals: user_Id } },
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.GetQuizzes;
  };

  const post = async (payload: QuizUncheckedCreateInput) => {
    const { data, error } = await useAsyncGql("CreateQuiz", {
      data: payload,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.CreateQuiz;
  };
  const del = async (x: string) => {
    const { data, error } = await useAsyncGql("DeleteQuiz", {
      id: x,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.DeleteQuiz;
  };

  const edit = async (id: string, info: QuizUpdateInput) => {
    const { data, error } = await useAsyncGql("UpdateQuiz", {
      id,
      data: info,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.UpdateQuiz;
  };

  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
