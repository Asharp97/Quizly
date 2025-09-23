import type {
  QuizSubmissionUpdateInput,
  QuizSubmissionWhereUniqueInput,
  QuizSubmissionCreateInput,
} from "#gql";
import { SortOrder } from "#gql/default";

export const useQuizSubmission = () => {
  const session = useSession();

  const get = async (id: string) => {
    const { GetQuizSubmission } = await GqlGetQuizSubmission({ id });
    return GetQuizSubmission;
  };

  const getAll = async () => {
    if (!session.user) {
      navigateTo("/", { replace: true });
      throw new Error("No user in session");
    }
    const user_Id: string = session.user?.id;
    const { GetQuizSubmissions } = await GqlGetQuizSubmissions({
      where: { userId: { equals: user_Id }, deletedAt: { equals: null } },
      orderBy: { createdAt: SortOrder.Asc },
    });
    return GetQuizSubmissions;
  };

  const post = async (data: QuizSubmissionCreateInput) => {
    const { CreateQuizSubmission } = await GqlCreateQuizSubmission({
      data,
    });
    return CreateQuizSubmission;
  };
  const del = async (id: string) => {
    const { DeleteQuizSubmission } = await GqlDeleteQuizSubmission({
      id,
    });
    return DeleteQuizSubmission;
  };

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

  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
