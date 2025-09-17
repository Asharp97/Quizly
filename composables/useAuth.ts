import { useSession } from "../stores/useSession";
export const useAuth = () => {
  const { setSession, resetSession } = useSession();

  const login = async (email: string, password: string) => {
    const { data, error } = await useAsyncGql("Login", {
      email,
      password,
    });

    if (error.value) {
      resetSession();
      throw error.value;
    }

    if (data.value?.Login) {
      setSession(data.value.Login);
      useGqlToken(data.value.Login.accessToken);
    } else {
      resetSession();
      return error.value;
      throw new Error("Login failed: No user data returned.");
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await useAsyncGql("SignUp", { email, password });

    if (error.value) {
      resetSession();
      throw error.value;
    }

    if (data.value?.SignUp) {
      setSession(data.value.SignUp);
      useGqlToken(data.value.SignUp.accessToken);
    } else {
      resetSession();
      throw new Error("SignUp failed: No user data returned.");
    }
  };

  const logout = async () => {
    const { error } = await useAsyncGql("Logout");
    if (error.value) {
      throw error.value;
    }
    resetSession();
    useGqlToken(null);
  };

  const refreshToken = async () => {
    const token = useCookie("refreshToken").value;
    if (!token) {
      resetSession();
      throw new Error("No refresh token found.");
    }
    const { data, error } = await useAsyncGql("RefreshToken", {
      refreshToken: token,
    });
    if (error.value) {
      throw error.value;
    }
    if (data.value?.RefreshToken) {
      setSession(data.value.RefreshToken);
    } else {
      resetSession();
      throw new Error("RefreshToken failed: No user data returned.");
    }
  };

  return {
    login,
    signUp,
    logout,
    refreshToken,
  };
};
