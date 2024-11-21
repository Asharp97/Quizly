<template>
  <div>
    <Transition name="scale-up">
      <div
        v-if="condition"
        class="modal-bg FullScreenModal"
        @click.self="modal.close"
      >
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

onKeyStroke("Escape", (e) => {
  e.preventDefault();
  modal.close();
  setTimeout(() => {
    emit("clearInputs"); // Emit the event after 2 seconds
  }, 2000);
});
</script>
