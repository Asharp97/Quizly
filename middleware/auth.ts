export default defineNuxtRouteMiddleware((to, from) => {
  const session = useSession();
  const modal = useModal();
  // console.log(session.user);
  if (!session.user) {
    modal.showAuth();
    // return abortNavigation();
  }
});
