import { ref } from "vue";

export function useSession() {
  // State variables
  const user = ref(false);
  const token = ref("");

  // Methods for managing session state
  function setUser(newUser: boolean) {
    user.value = newUser;
  }

  function setToken(newToken: string) {
    token.value = newToken;
  }

  function clearSession() {
    user.value = false;
    token.value = "";
  }

  // Persist the state using localStorage
  if (process.client) {
    // Load from localStorage when initialized
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) user.value = JSON.parse(storedUser);
    if (storedToken) token.value = storedToken;

    // Watch for changes and update localStorage
    watch(
      [user, token],
      () => {
        localStorage.setItem("user", JSON.stringify(user.value));
        localStorage.setItem("token", token.value);
      },
      { deep: true }
    );
  }

  return {
    user,
    token,
    setUser,
    setToken,
    clearSession,
  };
}
