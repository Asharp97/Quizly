<template>
  <div class="auth">
    <Transition name="slide-right">
      <div
        v-if="
          modal.show == ModalType.AUTH || modal.show == ModalType.AUTH_SIGNUP
        "
        class="auth-media FullScreenModal">
        <img src="" alt="" />
      </div>
    </Transition>
    <Transition name="slide-left">
      <div
        data-testid="auth-form"
        v-if="
          modal.show == ModalType.AUTH || modal.show == ModalType.AUTH_SIGNUP
        "
        class="auth-forms FullScreenModal">
        <Icon
          class="close"
          name="material-symbols:close-rounded"
          @click="modal.close" />

        <div class="form">
          <h2>Login or Sign up</h2>
          <p>
            Create an account and unlock powerful tools to make quizzes, forms,
            and more!
          </p>

          <AuthForm />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const modal = useModal();
</script>

<style lang="scss" scoped>
.form {
  h2 {
    margin-bottom: 1rem;
  }
  p{
    margin-bottom: 2rem;
  }
}
</style>
