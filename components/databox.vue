<template>
  <div>
    <div class="box">
      <div class="title">
        <h3>{{ title }}</h3>
        <Icon :name="icon" class="icon" />
      </div>
      <h1>{{ number }}</h1>
    </div>
  </div>
</template>

<script setup>
defineProps(["icon", "title", "number"]);
</script>

<style lang="scss" scoped></style>
