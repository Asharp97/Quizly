import type {
  QuestionUncheckedCreateInput,
  QuestionUpdateInput,
} from "#gql/default";

export const useQuestion = () => {
  const get = async (x: string) => {
    const { data, error } = await useAsyncGql("GetQuestion", {
      id: x,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.GetQuestion;
  };

  const getAll = async (quiz_id: string) => {
    if (!quiz_id) return [];
    const { data, error } = await useAsyncGql("GetQuestions", {
      where: { quizId: { equals: quiz_id } },
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.GetQuestions;
  };

  const post = async (payload: QuestionUncheckedCreateInput) => {
    const { data, error } = await useAsyncGql("CreateQuestion", {
      data: payload,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.CreateQuestion;
  };

  const del = async (x: string) => {
    const { data, error } = await useAsyncGql("DeleteQuestion", {
      id: x,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.DeleteQuestion;
  };

  const edit = async (id: string, info: QuestionUpdateInput) => {
    const { data, error } = await useAsyncGql("UpdateQuestion", {
      id,
      data: info,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.UpdateQuestion;
  };

  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
