import { defineStore } from "pinia";

export const useModal = defineStore("modal", () => {
  const show = ref(false);
  const confirm = ref(false);

  function close() {
    show.value = false;
    confirm.value = false;
  }

  return { show, confirm, close };
});
