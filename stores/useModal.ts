import { defineStore } from "pinia";

// Enum for modal types used throughout the app
export enum ModalType {
  POST_QUESTION = "postQuestion",
  EDIT_QUESTION = "editQuestion",
  DELETE_QUESTION = "deleteQuestion",
  POST_QUIZ = "postQuiz",
  EDIT_QUIZ = "editQuiz",
  DELETE_QUIZ = "deleteQuiz",
  LOGOUT_CONFIRM = "logoutConfirm",
  SHARE_QUIZ = "shareQuiz",
  AUTH = "auth",
  AUTH_SIGNUP = "authSignUp",
  END_QUIZ = "endQuiz",
}

// Pinia store for managing modal state
export const useModal = defineStore("modal", () => {
  // Tracks which modal is currently shown
  const show = ref("");

  // Closes any open modal
  function close() {
    show.value = "";
  }

  // Expose modal state and functions
  return { show, close };
});
