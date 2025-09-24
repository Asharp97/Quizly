import { defineStore } from "pinia";
import type { authResponseDTO, user } from "~/utils/types";

// Pinia store for managing user session and authentication state
export const useSession = defineStore("session", () => {
  // Stores the current user object
  const user = ref<user | null>(null);

  const cookieOptions = {
    maxAge: 60 * 15, // 15 minutes
    // secure: true, // Uncomment if using HTTPS
    // httpOnly: true, // Uncomment to prevent client-side access
    // sameSite: 'lax', // Adjust based on your needs
  };
  // Access and refresh tokens from cookies
  const accessToken = useCookie("accessToken", cookieOptions);
  const refreshToken = useCookie("refreshToken");
  const isLoggedIn = computed(() => !!accessToken.value);

  // Options for cookie storage

  // Sets session data from authentication response
  const setSession = (session: authResponseDTO) => {
    if (!session || !session.user) return;
    user.value = session.user;

    accessToken.value = session.accessToken;
    refreshToken.value = session.refreshToken;
  };

  // Clears session and tokens
  const resetSession = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
  };

  // Computed property to check if user is logged in

  // Fetches current user info from API if token exists
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

  // Sets tokens from OAuth login
  const setTokensFromOAuth = (accessToken: string, refreshToken: string) => {
    if (!accessToken || !refreshToken) return;
    useCookie("accessToken", cookieOptions).value = accessToken;
    useCookie("refreshToken").value = refreshToken;
  };

  // Expose session state and methods
  return {
    user,
    isLoggedIn,
    fetchCurrentUser,
    setSession,
    resetSession,
    setTokensFromOAuth,
  };
});
