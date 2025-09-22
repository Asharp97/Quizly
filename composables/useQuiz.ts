import type {
  CreateQuizInput,
  QuizUpdateInput,
  QuizWhereUniqueInput,
} from "#gql";
import { SortOrder } from "#gql/default";
import verifyQuiz from "~/middleware/verify-quiz";

export const useQuiz = () => {
  const session = useSession();

  const get = async (where: QuizWhereUniqueInput) => {
    const { GetQuiz } = await GqlGetQuiz({
      where,
    });
    return GetQuiz;
  };

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

  const post = async (data: CreateQuizInput) => {
    const { CreateQuiz } = await GqlCreateQuiz({
      data,
    });
    return CreateQuiz;
  };
  const del = async (id: string) => {
    const { DeleteQuiz } = await GqlDeleteQuiz({
      id,
    });
    return DeleteQuiz;
  };

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
  const verifyQuiz = async (link: string) => {
    const { VerifyQuizLink } = await GqlVerifyQuizLink({
      link,
    });
    return VerifyQuizLink ? VerifyQuizLink : null;
  };

  return {
    getAll,
    get,
    post,
    del,
    edit,
    verifyQuiz,
  };
};
