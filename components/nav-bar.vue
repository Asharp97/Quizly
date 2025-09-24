<template>
  <div>
    <nav>
      <div class="nav-content container">
        <NuxtLink to="/" class="logo">
          <img src="/img/logo.png" alt="quizly logo" />
        </NuxtLink>

        <UserMenu v-if="isLoggedIn" />

        <div v-else class="auth-buttons">
          <Btn text="Sign Up" @click="modal.show = ModalType.AUTH_SIGNUP" />
          <Btn text="Login" inv="true" @click="modal.show = ModalType.AUTH" />
        </div>
      </div>
    </nav>
    <Teleport to="body">
      <Auth />
    </Teleport>
  </div>
</template>

<script setup>
const modal = useModal();
const session = useSession();
const { isLoggedIn } = storeToRefs(session);
</script>

<style lang="scss" scoped></style>
