<template>
  <div>
    <aside class="workspaces">
      i'm the side dashboard
    </aside>


  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin-dashboard'
});
</script>

<style lang="scss" scoped></style>