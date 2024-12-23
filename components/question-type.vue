<template>
  <div class="question-type">
    <h3 v-if="title">Question Type</h3>
    <br />
    <span>
      <input id="mcq" v-model="question.type" type="radio" value="mcq" />
      <label for="mcq">Multiple Choice</label> </span
    ><span>
      <input id="tf" v-model="question.type" type="radio" value="tf" />
      <label for="tf">True Or False</label> </span
    ><span>
      <input id="text" v-model="question.type" type="radio" value="oe" />
      <label for="text">Open Ended</label>
    </span>
  </div>
</template>

<script setup>
defineProps(["title"]);
const question = useQuestion();
</script>

<style lang="scss" scoped>
.question-type {
  min-width: 10rem;
  display: flex;
  flex-direction: column;
  span {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>
