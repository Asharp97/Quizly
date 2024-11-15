<template>
  <div class="auth ">
    <Transition name="slide-right">
      <div v-if="modal.auth" class="auth-media FullScreenModal">
        <img src="" alt="">
      </div>
    </Transition>
    <Transition name="slide-left">
      <div v-if="modal.auth" class="auth-forms FullScreenModal">
        <Icon class="close" name="material-symbols:close-rounded" @click="modal.close" />

        <div class="form">
          <h2>Login or Sign up</h2>
          <p>Create an account and unlock powerful tools to make quizzes, forms, and more!</p>

          <AuthForm />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const modal = useModal();
</script>

<style lang="scss" scoped></style>
