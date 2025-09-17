export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = useSession();
  const { isLoggedIn } = storeToRefs(session);

  if (!session.user && useCookie("accessToken").value) {
    await session.fetchCurrentUser();
  }

  if (!isLoggedIn.value) {
    return navigateTo("/", { replace: true });
  }
});
