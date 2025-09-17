import type {
  AnswerUncheckedCreateInput,
  AnswerUpdateInput,
} from "#gql/default";

export const useAnswer = () => {
  const get = async (x: string) => {
    const { data, error } = await useAsyncGql("GetAnswer", {
      id: x,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.GetAnswer;
  };

  const getAll = async (question_id: string) => {
    if (!question_id) return [];
    const { data, error } = await useAsyncGql("GetAnswers", {
      where: { questionId: { equals: question_id } },
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.GetAnswers;
  };

  const post = async (payload: AnswerUncheckedCreateInput) => {
    const { data, error } = await useAsyncGql("CreateAnswer", {
      data: payload,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.CreateAnswer;
  };

  const del = async (x: string) => {
    const { data, error } = await useAsyncGql("DeleteAnswer", {
      id: x,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.DeleteAnswer;
  };

  const edit = async (id: string, info: AnswerUpdateInput) => {
    const { data, error } = await useAsyncGql("UpdateAnswer", {
      id,
      data: info,
    });
    if (error.value) {
      throw error.value;
    }
    return data.value.UpdateAnswer;
  };

  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
