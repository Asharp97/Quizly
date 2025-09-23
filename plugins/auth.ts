// Nuxt plugin to initialize authentication for GraphQL requests
export default defineNuxtPlugin(async (nuxtApp) => {
  // Hook to set the GraphQL auth token from cookie
  nuxtApp.hook("gql:auth:init", ({ token }) => {
    const tokenCookie = useCookie("accessToken");
    token.value = tokenCookie.value || undefined;
  });

  // After authentication is configured, fetch the current user if token exists
  // When fetchCurrentUser calls useAsyncGql, the hook above will be triggered,
  // and the request will be properly authenticated.
  const sessionStore = useSession();
  if (useCookie("accessToken").value) {
    await sessionStore.fetchCurrentUser();
  }
});
