export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useSession();
  if (!user) {
    return navigateTo("/");
  }
});
