import type {
  AnswerSubmissionUpdateInput,
  AnswerSubmissionWhereUniqueInput,
  AnswerSubmissionCreateInput,
} from "#gql";
import { SortOrder } from "#gql/default";

export const useAnswerSubmission = () => {
  const session = useSession();

  const get = async (id: string) => {
    const { GetAnswerSubmission } = await GqlGetAnswerSubmission({ id });
    return GetAnswerSubmission;
  };

  const getAll = async () => {
    if (!session.user) {
      navigateTo("/", { replace: true });
      throw new Error("No user in session");
    }
    const user_Id: string = session.user?.id;
    const { GetAnswerSubmissions } = await GqlGetAnswerSubmissions({
      where: { deletedAt: { equals: null } },
      orderBy: { createdAt: SortOrder.Asc },
    });
    return GetAnswerSubmissions;
  };

  const post = async (data: AnswerSubmissionCreateInput) => {
    const { CreateAnswerSubmission } = await GqlCreateAnswerSubmission({
      data,
    });
    return CreateAnswerSubmission;
  };

  const del = async (id: string) => {
    const { DeleteAnswerSubmission } = await GqlDeleteAnswerSubmission({
      id,
    });
    return DeleteAnswerSubmission;
  };

  const edit = async (id: string, data: AnswerSubmissionUpdateInput) => {
    // const allowedFields = [
    //   "title",
    //   "description",
    //   "timeLimit",
    //   "deadline",
    //   "publishedAt",
    //   "enableFeedback",
    // ];
    // const updateData: Record<string, any> = {};

    // allowedFields.forEach((key) => {
    //   if (key in data) {
    //     updateData[key] = { set: (data as Record<string, any>)[key] };
    //   }
    // });

    const { UpdateAnswerSubmission } = await GqlUpdateAnswerSubmission({
      id,
      data,
    });
    return UpdateAnswerSubmission;
  };

  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
