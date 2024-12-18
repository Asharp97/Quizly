<template>
  <div class="results">
    <participants-table :limit="null" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
</script>

<style lang="scss" scoped></style>
