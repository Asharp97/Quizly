<template>
  <div>
    <Transition name="scale-up">
      <div v-if="modal.confirm" class="bg FullScreenModal" @click.self="modal.close">
        <div class="card">
          <Icon :name="icon" class="icon" />
          <h3> {{ msg }} </h3>
          <div class="button-group">
            <button @click="$emit('confirm')">{{ actionText }}</button>
            <button @click="modal.close">{{ cancelText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onKeyStroke } from '@vueuse/core'
defineProps(['msg', 'action-Text', 'cancel-text', 'icon'])
const modal = useModal();

onKeyStroke('Escape', (e) => {
  e.preventDefault()
  modal.close()
})

</script>

<style lang="scss" scoped>
.bg {
  background-color: rgba(0, 0, 0, 0.479);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  backdrop-filter: blur(1rem);

  .card {
    background-color: $offwhite;
    height: 16rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    border-radius: 2rem;

    .icon {
      font-size: 5rem;
      color: $orange;
      margin-bottom: 1rem;
    }

    .button-group {
      display: flex;
      justify-content: space-evenly;
      gap: 1rem;

      button {
        margin-bottom: 0;
      }
    }
  }
}

.scale-up-enter-active {
  .bg {
    animation: blur .5s $brake;
  }

  .card {
    animation: scale-up .5s $brake;
  }
}

.scale-up-leave-active {
  .bg {
    animation: blur .5s ease-out reverse;
  }

  .card {
    animation: scale-up .5s ease reverse;
  }
}

@keyframes scale-up {
  0% {
    opacity: 0;
    scale: 0.5;
  }

  100% {
    opacity: 1;
    scale: 1;
  }
}

@keyframes blur {
  0% {
    backdrop-filter: blur(0px);
  }

  100% {
    backdrop-filter: blur(1rem);
  }
}
</style>