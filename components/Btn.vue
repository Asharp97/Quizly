<template>
  <NuxtLink
    :to="`${destination ? '/' + destination : ''}`"
    class="button-wrapper">
    <button
      :disabled="disabled == true"
      type="button"
      :class="[
        { inv: inv },
        { provider: provider },
        { orange: orange },
        { disabled: disabled },
      ]">
      <Icon
        :name="icon"
        v-if="icon"
        class="icon"
        :class="{ loading: loading }" />
      {{ text }}
      <slot />
    </button>
  </NuxtLink>
</template>

<script setup>
defineProps([
  "text",
  "loading",
  "destination",
  "icon",
  "inv",
  "provider",
  "orange",
  "disabled",
]);
</script>

<style lang="scss" scoped>
button {
  background-color: $blue;
  border: 1px solid $blue;
  color: $white;
  font-size: clamp(0.9375rem, 0.841rem + 0.5149vw, 1.25rem);
  width: 100%;
  font: 500 16px / 150% -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}

.inv {
  background-color: $white;
  color: $blue;
  border: 1px solid $blue;
}
.orange {
  background-color: $orange;
  border: 1px solid $orange;
  .icon {
    background-color: white;
  }
}
.disabled {
  scale: 0.8;
  background-color: $dimgrey;
  border: 1px solid $dimgrey;
  .icon {
    transform: rotate(45deg);
  }
}
.provider {
  background-color: $white;
  color: rgb(94, 94, 94);
  border: 1px solid $lightgrey;
  font-weight: 500;

  &:active,
  &:hover {
    background-color: $lightgrey;
  }
}

button {
  margin-bottom: 0;

  &:active,
  &:hover {
    opacity: 0.8;
  }
}
</style>
