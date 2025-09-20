export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hook("gql:auth:init", ({ token }) => {
    const tokenCookie = useCookie("accessToken");
    token.value = tokenCookie.value || undefined;
  });

  // 2. Now that authentication is configured, fetch the current user.
  // When fetchCurrentUser calls useAsyncGql, the hook above will be triggered,
  // and the request will be properly authenticated.
  const sessionStore = useSession();
  if (useCookie("accessToken").value) {
    await sessionStore.fetchCurrentUser();
  }
});
