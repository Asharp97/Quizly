import { defineStore } from "pinia";

export const useModal = defineStore("modal", () => {
  const auth = ref(false);
  const confirm = ref(false);

  function close() {
    auth.value = false;
    confirm.value = false;
  }
  function showAuth() {
    auth.value = true;
  }

  return { auth, confirm, close, showAuth };
});
