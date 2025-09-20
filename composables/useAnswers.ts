import type {
  AnswerUncheckedCreateInput,
  AnswerUpdateInput,
} from "#gql/default";

export const useAnswer = () => {
  const get = async (id: string) => {
    const { GetAnswer } = await GqlGetAnswer({
      id,
    });
    return GetAnswer;
  };

  const getAll = async (question_id: string) => {
    if (!question_id) return [];
    const { GetAnswers } = await GqlGetAnswers({
      where: {
        questionId: { equals: question_id },
        deletedAt: { equals: null },
      },
    });
    return GetAnswers;
  };

  const post = async (data: AnswerUncheckedCreateInput) => {
    const { CreateAnswer } = await GqlCreateAnswer({
      data,
    });
    return CreateAnswer;
  };

  const del = async (id: string) => {
    const { DeleteAnswer } = await GqlDeleteAnswer({
      id,
    });
    return DeleteAnswer;
  };

  const edit = async (id: string, data: AnswerUpdateInput) => {
    const { UpdateAnswer } = await GqlUpdateAnswer({
      id,
      data,
    });
    return UpdateAnswer;
  };

  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
