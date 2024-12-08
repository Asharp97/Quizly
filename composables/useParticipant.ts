import { defineStore } from "pinia";

export const useParticipant = defineStore(
  "participant",
  () => {
    const id = ref(null);

    function reset() {
      id.value = null;
    }
    function set(x: any) {
      id.value = x.id;
    }

    return { id, reset, set };
  },
  {
    persist: true,
  }
);
