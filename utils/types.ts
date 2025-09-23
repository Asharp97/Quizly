// Type definitions for Quizly app, based on GraphQL queries
import type {
  GetAnswersQuery,
  GetQuestionsQuery,
  GetQuizzesQuery,
  RefreshTokenMutation,
} from "#gql/default";

// Quiz type from GetQuizzes GraphQL query
export type Quiz = GetQuizzesQuery["GetQuizzes"][0];
// Question type from GetQuestions GraphQL query
export type Question = GetQuestionsQuery["GetQuestions"][0];
// Answer type from GetAnswers GraphQL query
export type Answer = GetAnswersQuery["GetAnswers"][0];

// Authentication response DTO from RefreshToken mutation
export type authResponseDTO = RefreshTokenMutation["RefreshToken"];

// User type from authentication response
export type user = authResponseDTO["user"];
