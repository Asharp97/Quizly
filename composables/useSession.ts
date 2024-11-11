// export const useSession = () => useState("sesssion", () => null);

import { defineStore } from "pinia";

export const useSession = defineStore("session", {
  state: () => {
    return {
      user: null,
      token: "",
    };
  },
  persist: true,
});