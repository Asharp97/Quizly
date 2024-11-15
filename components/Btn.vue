<template>
  <NuxtLink :to="`${destination ? '/' + destination : ''}`">
    <button type="button" :class="[{ 'inv': inv }, { 'provider': provider }]">
      <Icon :name="icon" v-if="icon" />
      {{ text }}
      <slot />
    </button>
  </NuxtLink>
</template>

<script setup>
defineProps(['text', 'destination', "icon", 'inv', 'provider']);
</script>

<style lang="scss" scoped>
button {
  background-color: $blue;
  border: 1px solid $blue;
  color: $white;
  font-size: clamp(0.9375rem, 0.841rem + 0.5149vw, 1.25rem);
  width: 100%;
  font: 500 16px / 150% -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.inv {
  background-color: $white;
  color: $blue ;
  border: 1px solid $blue;
}

.provider {
  background-color: $white;
  color: rgb(94, 94, 94);
  border: 1px solid $grey;
  font-weight: 500;

  &:active,
  &:hover {
    background-color: $grey;
  }
}


button {
  margin-bottom: 0;

  &:active,
  &:hover {
    opacity: .8;
  }
}
</style>