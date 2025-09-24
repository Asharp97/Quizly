<template>
  <div>
    <Transition name="scale-up">
      <!-- v-show="condition.includes(modal.show)" -->
      <div
        v-if="condition"
        class="modal-bg FullScreenModal"
        @click.self="close()">
        <div class="card">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onKeyStroke } from "@vueuse/core";
defineProps(["condition"]);
const modal = useModal();

const close = () => {
  modal.close();
};

onKeyStroke("Escape", (e) => {
  e.preventDefault();
  modal.close();
});
</script>
