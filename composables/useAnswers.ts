import type { AnswerCreateInput, AnswerUpdateInput } from "#gql/default";

// Composable for managing answers via GraphQL API
export const useAnswer = () => {
  // Fetches a single answer by ID
  const get = async (id: string) => {
    const { GetAnswer } = await GqlGetAnswer({
      id,
    });
    return GetAnswer;
  };

  // Fetches all answers for a given question
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

  // Creates a new answer
  const post = async (data: AnswerCreateInput) => {
    const { CreateAnswer } = await GqlCreateAnswer({
      data,
    });
    return CreateAnswer;
  };

  // Deletes an answer by ID
  const del = async (id: string) => {
    const { DeleteAnswer } = await GqlDeleteAnswer({
      id,
    });
    return DeleteAnswer;
  };

  // Updates an answer by ID
  const edit = async (id: string, data: AnswerUpdateInput) => {
    const { UpdateAnswer } = await GqlUpdateAnswer({
      id,
      data,
    });
    return UpdateAnswer;
  };

  // Expose answer management functions
  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
