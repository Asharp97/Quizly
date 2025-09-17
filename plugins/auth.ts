export default defineNuxtPlugin(async (nuxtApp) => {

    const sessionStore = useSession();
    await sessionStore.fetchCurrentUser();

  // access cookie for auth
  const tokenCookie = useCookie('accessToken')

  nuxtApp.hook('gql:auth:init', ({ client, token }) => {
    // `client` can be used to differentiate logic on a per client basis.

    // apply client token
    token.value = tokenCookie.value || null
  })
})
