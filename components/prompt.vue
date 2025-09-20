<template>
  <div>
    <Transition name="scale-up">
      <div
        v-show="modal.show === condition"
        class="modal-bg FullScreenModal"
        @click.self="modal.close">
        <div class="card">
          <Icon :name="icon" class="icon" />
          <h3>{{ msg }}</h3>
          <div class="button-group">
            <button v-if="actionText" @click="$emit('confirm')">
              {{ actionText }}
            </button>
            <button v-if="cancelText" @click="modal.close">
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onKeyStroke } from "@vueuse/core";
defineProps(["msg", "action-Text", "cancel-text", "icon", "condition"]);

const modal = useModal();

onKeyStroke("Escape", (e) => {
  e.preventDefault();
  modal.close();
});
</script>

<style lang="scss" scoped></style>
