<template>
  <div>
    <button type="button" :class="[{ 'active': active }]">
      {{ text }}
      <slot />
    </button>
  </div>
</template>

<script setup>
defineProps(['text', 'active']);
</script>

<style lang="scss" scoped>
button {
  background-color: transparent;
  color: $dimgrey;
  font-size: clamp(0.9375rem, 0.841rem + 0.5149vw, 1.25rem);

  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  border: 2px solid $grey;
  border-bottom: 0px solid white;
  margin-bottom: 0;

  &:active,
  &:hover {
    background-color: $grey;
  }
}

.active {
  background-color: $blue;
  color: $white;

  &:active,
  &:hover {
    color: $blue;
    background-color: $grey;
  }
}
</style>