import { defineStore } from "pinia";
import type { authResponseDTO, user } from "~/utils/types";

export const useSession = defineStore("session", () => {
  const user = ref<user | null>(null);

  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");

  const cookieOptions = {
    maxAge: 60 * 15, // 15 minutes
    // secure: true, // Uncomment if using HTTPS
    // httpOnly: true, // Uncomment to prevent client-side access
    // sameSite: 'lax', // Adjust based on your needs
  };
  const setSession = (session: authResponseDTO) => {
    if (!session || !session.user) return;
    user.value = session.user;

    useCookie("accessToken", cookieOptions).value = session.accessToken;
    useCookie("refreshToken").value = session.refreshToken;
  };

  const resetSession = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
  };

  const isLoggedIn = computed(() => !!accessToken.value);

  const fetchCurrentUser = async () => {
    const token = useCookie("accessToken");
    if (!token.value) {
      resetSession();
      return;
    }

    const { data } = await useAsyncGql("Me");

    if (data.value?.Me) user.value = data.value.Me;
    else console.log("No user data returned from Me query");
  };

  const setTokensFromOAuth = (accessToken: string, refreshToken: string) => {
    if (!accessToken || !refreshToken) return;
    useCookie("accessToken", cookieOptions).value = accessToken;
    useCookie("refreshToken").value = refreshToken;
  };

  return {
    user,
    isLoggedIn,
    fetchCurrentUser,
    setSession,
    resetSession,
    setTokensFromOAuth,
  };
});
