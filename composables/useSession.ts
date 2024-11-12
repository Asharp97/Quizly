import { defineStore } from "pinia";

export const useSession = defineStore(
  "session",
  () => {
    const user = ref("");
    const token = ref("");

    function clearSession() {
      user.value = "";
      token.value = "";
    }

    return { user, token, clearSession };
  },
  {
    persist: true,
  }
);
