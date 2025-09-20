<template>
  <div class="question-type">
    <h3 v-if="title">Question Type</h3>
    <br />
    <span>
      <input
        id="mcq"
        v-model="computedQuestionType"
        type="radio"
        :value="Question_Type.MULTIPLE_CHOICE" />
      <label for="mcq">Multiple Choice</label> </span
    ><span>
      <input
        id="tf"
        v-model="computedQuestionType"
        type="radio"
        :value="Question_Type.TRUE_FALSE" />
      <label for="tf">True Or False</label> </span
    ><span>
      <input
        id="text"
        v-model="computedQuestionType"
        type="radio"
        :value="Question_Type.SHORT_ANSWER" />
      <label for="text">Open Ended</label>
    </span>
  </div>
</template>

<script setup>
import { Question_Type } from "#gql/default";

const props = defineProps(["title", "questionType"]);
const emit = defineEmits(["update:questionType"]);

// 2. Create a writable computed property
const computedQuestionType = computed({
  // The getter returns the current value of the prop
  get() {
    return props.questionType;
  },
  // The setter emits an event to the parent when the value changes
  set(newValue) {
    emit("update:questionType", newValue);
  },
});
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
