<template>
  <!-- <div v-if="data">
    <h1>API Response</h1>
    <p>{{ data.message }}</p>
  </div> -->
  <div>
    hey
    <button @click="run()">lcick</button>
  </div>
</template>

<script setup lang="ts">

const run = async () => {
  const { data, error } = await useFetch("/api/unstructured");

};
</script>
