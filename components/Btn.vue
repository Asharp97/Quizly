<template>
  <div>
    <NuxtLink :to="`${destination ? '/' + destination : ''}`">
      <button type="button" :class="{ 'inv': inv }">
        <Icon :name="icon" v-if="icon" />
        {{ text }}
        <slot />
      </button>
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps(['text', 'destination', "icon", 'inv']);
</script>

<style lang="scss" scoped>
button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: $dimgrey;
  border: 1px solid $grey;
  color: $white;
  padding: 0.5rem 1rem;
  border-radius: .5rem;
  font-size: clamp(0.9375rem, 0.841rem + 0.5149vw, 1.25rem);
  white-space: nowrap;
  margin-inline: auto;
  cursor: pointer;
  width: 100%;

}

.inv {
  background-color: $white;
  color: $dimgrey ;
  border: 1px solid $dimgrey;

  &:active,
  &:hover {
    border: 1px solid $dimgrey;
    background-color: $offwhite;
    color: $grey;
  }
}

button {

  &:active,
  &:hover {
    border: 1px solid $dimgrey;
    background-color: $grey;
    color: $white;
  }
}
</style>