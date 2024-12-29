<template>
  <div>
    <nav>
      <div class="nav-content container">
        <NuxtLink to="/" class="logo">
          <img src="/img/logo.png" alt="quizly logo" />
        </NuxtLink>

        <UserMenu v-if="session.user" />

        <div v-else class="auth-buttons">
          <Btn text="Sign Up" @click="modal.auth = true" />
          <Btn text="Login" inv="true" @click="modal.auth = true" />
        </div>
      </div>
    </nav>
    <Teleport to="body">
      <Auth />
    </Teleport>
  </div>
</template>

<script setup>
const session = useSession();
const modal = useModal();
</script>

<style lang="scss" scoped></style>
