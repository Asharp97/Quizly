import type {
  AnswerSubmissionUpdateInput,
  AnswerSubmissionWhereUniqueInput,
  AnswerSubmissionCreateInput,
} from "#gql";
import { SortOrder } from "#gql/default";

// Composable for managing answer submissions via GraphQL API
export const useAnswerSubmission = () => {
  const session = useSession(); // Access user session

  // Fetches a single answer submission by ID
  const get = async (id: string) => {
    const { GetAnswerSubmission } = await GqlGetAnswerSubmission({ id });
    return GetAnswerSubmission;
  };

  // Fetches all answer submissions for the current user
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

  // Creates a new answer submission
  const post = async (data: AnswerSubmissionCreateInput) => {
    const { CreateAnswerSubmission } = await GqlCreateAnswerSubmission({
      data,
    });
    return CreateAnswerSubmission;
  };

  // Deletes an answer submission by ID
  const del = async (id: string) => {
    const { DeleteAnswerSubmission } = await GqlDeleteAnswerSubmission({
      id,
    });
    return DeleteAnswerSubmission;
  };

  // Updates an answer submission by ID
  const edit = async (id: string, data: AnswerSubmissionUpdateInput) => {
    // Directly updates answer submission fields
    const { UpdateAnswerSubmission } = await GqlUpdateAnswerSubmission({
      id,
      data,
    });
    return UpdateAnswerSubmission;
  };

  // Expose answer submission management functions
  return {
    getAll,
    get,
    post,
    del,
    edit,
  };
};
