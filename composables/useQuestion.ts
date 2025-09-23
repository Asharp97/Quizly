import type {
  QuestionUncheckedCreateInput,
  QuestionUpdateInput,
} from "#gql/default";

// Composable for managing questions via GraphQL API
export const useQuestion = () => {
  // Fetches a single question by ID
  const get = async (id: string) => {
    const { GetQuestion } = await GqlGetQuestion({
      id,
    });
    return GetQuestion;
  };

  // Fetches all questions for a given quiz
  const getAll = async (quiz_id: string) => {
    if (!quiz_id) return [];
    const { GetQuestions } = await GqlGetQuestions({
      where: { quizId: { equals: quiz_id }, deletedAt: { equals: null } },
    });
    return GetQuestions;
  };

  // Creates a new question
  const post = async (data: QuestionUncheckedCreateInput) => {
    const { CreateQuestion } = await GqlCreateQuestion({
      data,
    });
    return CreateQuestion;
  };

  // Deletes a question by ID
  const del = async (id: string) => {
    const { DeleteQuestion } = await GqlDeleteQuestion({
      id,
    });
    return DeleteQuestion;
  };

  // Updates a question by ID
  const edit = async (id: string, data: QuestionUpdateInput) => {
    const { UpdateQuestion } = await GqlUpdateQuestion({
      id,
      data,
    });
    return UpdateQuestion;
  };

  // Saves a question and its answers (used for MCQ)
  const save = async (
    question: QuestionUncheckedCreateInput,
    answers: Answer[]
  ) => {
    const questionId = question.id;
    if (!questionId) throw new Error("Question ID is required for updating");

    const { quizId, ...rest } = question;
    const questionUpdateInput = {
      ...rest,
      id: questionId,
      Quiz: quizId ? { connect: { id: quizId } } : undefined,
    };
    const { UpdateQuestionWithAnswers } = await GqlUpdateQuestionWithAnswers({
      questionId,
      question: questionUpdateInput,
      answers,
    });
    return UpdateQuestionWithAnswers;
  };

  // Expose question management functions
  return {
    getAll,
    get,
    post,
    del,
    edit,
    save,
  };
};
