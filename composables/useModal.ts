import { defineStore } from "pinia";

export const useModal = defineStore("modal", () => {
  const auth = ref(false);
  const confirm = ref(false);
  const show = ref('');

  function close() {
    auth.value = false;
    confirm.value = false;
    show.value = '';
  }
  function showAuth() {
    auth.value = true;
  }

  return { auth, confirm, show, close, showAuth };
});
