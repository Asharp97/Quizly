import { defineStore } from "pinia";

export const useSession = defineStore(
  "session",
  () => {
    const user = ref("");
    const token = ref("");

    function clear() {
      user.value = "";
      token.value = "";
    }
    function set(x: any) {
      user.value = x.user;
      token.value = x.session;
    }

    return { user, token, clear, set };
  },
  {
    persist: true,
  }
);
