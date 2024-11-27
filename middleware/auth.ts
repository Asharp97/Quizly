export default defineNuxtRouteMiddleware((to, from) => {
  const session = useSession();
  const modal = useModal();
  if (!session.user) {
    modal.showAuth();
  }
});
