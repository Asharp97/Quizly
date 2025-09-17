import { defineStore } from "pinia";

type user = {
  id: string;
  email: string;
  role: string;
  createdAt: any;
  updatedAt: any;
  deletedAt?: any | null;
};

export const useSession = defineStore("session", () => {
  const user = ref<user | null>(null);

  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");

  const setSession = (session: {
    user?: user | null;
    accessToken: string | null;
    refreshToken: string | null;
  }) => {
    if (!session || !session.user) return;
    user.value = session.user;

    const cookieOptions = {
      maxAge: 60 * 15, // 15 minutes
      // secure: true, // Uncomment if using HTTPS
      // httpOnly: true, // Uncomment to prevent client-side access
      // sameSite: 'lax', // Adjust based on your needs
    };

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

    // useGqlToken(token.value);
    const { data } = await useAsyncGql("Me");

    if (data.value?.Me) user.value = data.value.Me;
    else console.log("No user data returned from Me query");
  };

  return {
    user,
    isLoggedIn,
    fetchCurrentUser,
    setSession,
    resetSession,
  };
});
