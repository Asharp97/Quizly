<template>
  <div>
    <Transition name="scale-up">
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
const emit = defineEmits("clearInputs");
const modal = useModal();

const close = () => {
  modal.close();
  setTimeout(() => {
    emit("clearInputs");
  }, 500);
};

onKeyStroke("Escape", (e) => {
  e.preventDefault();
  modal.close();
  setTimeout(() => {
    emit("clearInputs");
  }, 500);
});
</script>
