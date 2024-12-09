import { defineStore } from "pinia";

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
