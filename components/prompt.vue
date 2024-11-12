<template>
  <div>
      <div class="bg FullScreenModal" @click.self="$emit('close')">
        <div class="card">
          <Icon :name="icon" class="icon" />
          <div class="row">
            <h3>
              {{ msg }}
            </h3>
          </div>
          <div class="button-group">
            <button @click="$emit('confirm')">{{ actionText }}</button>
            <button @click="$emit('close')">{{ cancelText }}</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
defineProps(['msg', 'actionText', 'cancelText', 'icon'])
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
    }

    .button-group {
      display: flex;
      justify-content: space-evenly;
      gap: 1rem;
    }
  }
}

.scale-up-enter-active {
  .bg {
    animation: blur .5s $brake;

    .card {
      animation: scale-up .5s $brake;
    }
  }
}

.scale-up-leave-active {
  .bg {
    animation: blur .5s ease-out reverse;

    .card {
      animation: scale-up .5s ease reverse;
    }
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