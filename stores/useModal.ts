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
  END_QUIZ = "endQuiz",
}

// Pinia store for managing modal state
export const useModal = defineStore("modal", () => {
  // Tracks if auth modal is open
  const auth = ref(false);
  // Tracks which modal is currently shown
  const show = ref("");

  // Closes any open modal
  function close() {
    auth.value = false;
    show.value = "";
  }

  // Opens the auth modal
  function showAuth() {
    auth.value = true;
  }

  // Expose modal state and functions
  return { auth, show, close, showAuth };
});
