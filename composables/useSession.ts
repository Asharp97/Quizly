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
    function setSession(x: any) {
      user.value = x.user;
      token.value = x.session;
    }

    return { user, token, clearSession, setSession };
  },
  {
    persist: true,
  }
);
