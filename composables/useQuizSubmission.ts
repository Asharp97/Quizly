import type {
  QuizSubmissionUpdateInput,
  CreateQuizSubmissionInput,
} from "#gql";
import { SortOrder } from "#gql/default";

// Composable for managing quiz submissions via GraphQL API
export const useQuizSubmission = () => {
  const session = useSession(); // Access user session

  // Fetches a single quiz submission by ID
  const get = async (id: string) => {
    const { GetQuizSubmission } = await GqlGetQuizSubmission({ id });
    return GetQuizSubmission;
  };

  // Fetches all quiz submissions for the current user
  const getAll = async (quizId: string) => {
    if (!session.user) {
      navigateTo("/", { replace: true });
      throw new Error("No user in session");
    }
    const user_Id: string = session.user?.id;
    const { GetQuizSubmissions } = await GqlGetQuizSubmissions({
      where: { deletedAt: { equals: null }, quizId: { equals: quizId } },
      orderBy: { createdAt: SortOrder.Asc },
    });
    return GetQuizSubmissions;
  };

  const getCount = async (quizId: string) => {
    const { GetQuizSubmissionsCount } = await GqlGetQuizSubmissionsCount({
      quizId,
    });
    return GetQuizSubmissionsCount;
  };

  // Creates a new quiz submission
  const post = async (data: CreateQuizSubmissionInput) => {
    const { CreateQuizSubmission } = await GqlCreateQuizSubmission({
      data,
    });
    return CreateQuizSubmission;
  };

  // Deletes a quiz submission by ID
  const del = async (id: string) => {
    const { DeleteQuizSubmission } = await GqlDeleteQuizSubmission({
      id,
    });
    return DeleteQuizSubmission;
  };

  // Updates a quiz submission by ID, only allowed fields
  const edit = async (id: string, data: QuizSubmissionUpdateInput) => {
    const allowedFields = [
      "title",
      "description",
      "timeLimit",
      "deadline",
      "publishedAt",
      "enableFeedback",
    ];
    const updateData: Record<string, any> = {};

    allowedFields.forEach((key) => {
      if (key in data) {
        updateData[key] = { set: (data as Record<string, any>)[key] };
      }
    });

    const { UpdateQuizSubmission } = await GqlUpdateQuizSubmission({
      id,
      data: updateData,
    });
    return UpdateQuizSubmission;
  };

  // Expose quiz submission management functions
  return {
    getAll,
    get,
    post,
    del,
    edit,
    getCount,
  };
};
