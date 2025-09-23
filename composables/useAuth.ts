import { useSession } from "../stores/useSession";

// Composable for handling authentication logic
export const useAuth = () => {
  const { setSession, resetSession } = useSession(); // Access session store

  // Logs in a user and sets session
  const login = async (email: string, password: string) => {
    const { Login } = await GqlLogin({ email, password });
    if (Login) setSession(Login);
    else resetSession();
    return Login;
  };

  // Signs up a new user and sets session
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

  // Logs out the user and resets session
  const logout = async () => {
    const { Logout } = await GqlLogout();
    resetSession();
    useGqlToken(null);
    return Logout;
  };

  // Refreshes authentication token and updates session
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

  // Expose authentication functions
  return {
    login,
    signUp,
    logout,
    refreshToken,
  };
};
