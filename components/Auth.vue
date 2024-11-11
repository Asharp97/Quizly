<template>
  <div class="auth ">
    <Transition name="slide-right">
      <div class="auth-media FullScreenModal" v-if="show">

      </div>
    </Transition>
    <Transition name="slide-left">
      <div class="auth-forms FullScreenModal" v-if="show">
        <Icon name="material-symbols:close-rounded" @click="$emit('close')" class="close" />

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
const props = defineProps(['show'])
</script>

<style lang="scss" scoped>
.slide-right-enter-active {
  animation: slide-right .5s $brake;
}

.slide-right-leave-active {
  animation: slide-right .5s $reversebrake reverse;
}

.slide-left-enter-active {
  animation: slide-left .5s $brake;
}

.slide-left-leave-active {
  animation: slide-left .5s $reversebrake reverse;
}


@keyframes slide-right {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes slide-left {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
