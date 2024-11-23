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


// (quiz_id IN ( SELECT quizes.id
//   FROM quizes
//  WHERE (quizes.workspace_id IN ( SELECT workspaces.id
//           FROM workspaces
//          WHERE (workspaces.user_id = auth.uid())))))