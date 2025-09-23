// Nuxt route middleware to protect routes and require authentication
export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = useSession(); // Get session composable
  const { isLoggedIn } = storeToRefs(session); // Reactive login state

  // If user object is missing but accessToken cookie exists, fetch user info
  if (!session.user && useCookie("accessToken").value) {
    await session.fetchCurrentUser();
  }

  // If not logged in, redirect to home page
  if (!isLoggedIn.value) {
    return navigateTo("/", { replace: true });
  }
});
