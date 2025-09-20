import { useSession } from "../stores/useSession";

export const useAuth = () => {
  const { setSession, resetSession } = useSession();

  const login = async (email: string, password: string) => {
    const { Login } = await GqlLogin({ email, password });
    if (Login) setSession(Login);
    else resetSession();
    return Login;
  };

  const signUp = async (email: string, password: string) => {
    const { SignUp } = await GqlSignUp({ email, password });
    if (SignUp) {
      setSession(SignUp);
      return SignUp;
    } else {
      resetSession();
      throw new Error("SignUp failed: No user data returned.");
    }
  };

  const logout = async () => {
    const { Logout } = await GqlLogout();
    resetSession();
    useGqlToken(null);
    return Logout;
  };

  const refreshToken = async () => {
    const token = useCookie("refreshToken").value;
    if (!token) {
      resetSession();
      throw new Error("No refresh token found.");
    }
    const { RefreshToken } = await GqlRefreshToken({ refreshToken: token });
    if (RefreshToken) {
      setSession(RefreshToken);
      return RefreshToken;
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
