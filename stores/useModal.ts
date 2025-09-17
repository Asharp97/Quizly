import { defineStore } from "pinia";

export enum ModalTypes {
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

export const useModal = defineStore("modal", () => {
  const auth = ref(false);
  const show = ref("");

  function close() {
    auth.value = false;
    show.value = "";
  }

  function showAuth() {
    auth.value = true;
  }

  return { auth, show, close, showAuth };
});
