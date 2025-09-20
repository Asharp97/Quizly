import type {
  QuestionUncheckedCreateInput,
  QuestionUpdateInput,
} from "#gql/default";

export const useQuestion = () => {
  const get = async (id: string) => {
    const { GetQuestion } = await GqlGetQuestion({
      id,
    });
    return GetQuestion;
  };

  const getAll = async (quiz_id: string) => {
    if (!quiz_id) return [];
    const { GetQuestions } = await GqlGetQuestions({
      where: { quizId: { equals: quiz_id }, deletedAt: { equals: null } },
    });
    return GetQuestions;
  };

  const post = async (data: QuestionUncheckedCreateInput) => {
    const { CreateQuestion } = await GqlCreateQuestion({
      data,
    });
    return CreateQuestion;
  };

  const del = async (id: string) => {
    const { DeleteQuestion } = await GqlDeleteQuestion({
      id,
    });
    return DeleteQuestion;
  };

  const edit = async (id: string, data: QuestionUpdateInput) => {
    const { UpdateQuestion } = await GqlUpdateQuestion({
      id,
      data,
    });
    return UpdateQuestion;
  };

  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
