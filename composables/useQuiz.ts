import type {
  CreateQuizInput,
  QuizUpdateInput,
  QuizWhereUniqueInput,
} from "#gql";
import { SortOrder } from "#gql/default";
import verifyQuiz from "~/middleware/verify-quiz";

// Composable for managing quizzes via GraphQL API
export const useQuiz = () => {
  const session = useSession(); // Access user session

  // Fetches a single quiz by unique identifier
  const get = async (where: QuizWhereUniqueInput) => {
    const { GetQuiz } = await GqlGetQuiz({
      where,
    });
    return GetQuiz;
  };

  // Fetches all quizzes for the current user
  const getAll = async () => {
    if (!session.user) {
      navigateTo("/", { replace: true });
      throw new Error("No user in session");
    }
    const user_Id: string = session.user?.id;
    const { GetQuizzes } = await GqlGetQuizzes({
      where: { userId: { equals: user_Id }, deletedAt: { equals: null } },
      orderBy: { createdAt: SortOrder.Asc },
    });
    return GetQuizzes;
  };

  // Creates a new quiz
  const post = async (data: CreateQuizInput) => {
    const { CreateQuiz } = await GqlCreateQuiz({
      data,
    });
    return CreateQuiz;
  };

  // Deletes a quiz by ID
  const del = async (id: string) => {
    const { DeleteQuiz } = await GqlDeleteQuiz({
      id,
    });
    return DeleteQuiz;
  };

  // Updates a quiz by ID, only allowed fields
  const edit = async (id: string, data: QuizUpdateInput) => {
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

    const { UpdateQuiz } = await GqlUpdateQuiz({
      id,
      data: updateData,
    });
    return UpdateQuiz;
  };

  // Verifies a quiz link and returns quiz if valid
  const verifyQuiz = async (link: string) => {
    const { VerifyQuizLink } = await GqlVerifyQuizLink({
      link,
    });
    return VerifyQuizLink ? VerifyQuizLink : null;
  };

  // Expose quiz management functions
  return {
    getAll,
    get,
    post,
    del,
    edit,
    verifyQuiz,
  };
};
