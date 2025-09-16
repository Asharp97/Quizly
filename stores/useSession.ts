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
    useCookie("accessToken").value = null;
    useCookie("refreshToken").value = null;
  };

  const isLoggedIn = computed(() => !!user.value);

  const setUser = (newUser: user) => {
    user.value = newUser;
  };

  const fetchCurrentUser = async () => {
    const token = useCookie("accessToken");
    if (!token.value) {
      resetSession();
      return;
    }

    const { data } = await useAsyncGql("Me");

    if (data.value?.Me) setUser(data.value.Me);
  };

  return {
    user,
    isLoggedIn,
    fetchCurrentUser,
    setSession,
    resetSession,
  };
});
