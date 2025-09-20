<template>
  <div>
    <admin-top-nav />
    <div class="row">
      <quiz-side-nav />
      <div class="dashboard">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
