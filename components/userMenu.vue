<template>
  <div>
    <div class="user dropdown showonhover">
      <NuxtLink to="/dashboard" class="item">
        <Icon class="icon" name="material-symbols:account-circle-full" />
      </NuxtLink>
      <div class="menu-bg">
        <div class="menu">
          <NuxtLink to="/dashboard" class="item"> Dashboard </NuxtLink>
          <NuxtLink to="/quiz-analytics" class="item"> Quiz Analytics</NuxtLink>
          <NuxtLink to="/participants" class="item">
            Participants Table</NuxtLink
          >
          <div class="item" @click="modal.show = ModalTypes.LOGOUT_CONFIRM">Logout</div>
        </div>
      </div>
    </div>
    <ClientOnly>
      <Teleport to="body">
        <prompt
          msg="Are you sure you want to logout?"
          action-text="Log me out"
          cancel-text="Nevermind"
          icon="material-symbols:logout"
          condition="confirm_logout"
          @confirm="logout" />
        <prompt
          msg="Your Quiz has been successfully Published"
          condition="quiz_submission"
          cancel-text="Okay"
          icon="line-md:confirm-circle" />
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup>
const router = useRouter();
const modal = useModal();
const auth = useAuth();

const logout = async () => {
  await auth.logout();
  modal.close();
  router.push("/");
};
</script>

<style lang="scss" scoped>
.user {
  .icon {
    font-size: 2rem;
    color: $blue;

    &:hover {
      color: $orange;
    }
  }
}
</style>
