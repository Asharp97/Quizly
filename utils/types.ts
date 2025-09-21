import type {
  GetAnswersQuery,
  GetQuestionsQuery,
  GetQuizzesQuery,
  RefreshTokenMutation,
} from "#gql/default";

export type Quiz = GetQuizzesQuery["GetQuizzes"][0];
export type Question = GetQuestionsQuery["GetQuestions"][0];
export type Answer = GetAnswersQuery["GetAnswers"][0];

export type authResponseDTO = RefreshTokenMutation["RefreshToken"];

export type user = authResponseDTO["user"];


