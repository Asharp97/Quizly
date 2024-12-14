<template>
  <div>
    <div class="quiz-wrapper">
      <h2>{{ question }}</h2>
      <div class="boxes">
        <div
          v-for="(ans, n) in answer"
          :key="ans.id"
          :class="{ selected: selectedAnswer.includes(n) }"
          class="box"
          @click="$emit('selectAnswer', n)">
          <h3>{{ ans.text }}</h3>
        </div>
      </div>
    </div>
    <div v-if="showArrows" class="icon-wrapper" @click="$emit('next')">
      <Icon name="material-symbols:chevron-right-rounded" class="icon" />
    </div>
  </div>
</template>

<script setup>
defineProps(["question", "selectedAnswer", "answer", "showArrows"]);
defineEmits(["next", "selectAnswer"]);
</script>

<style lang="scss" scoped>
.quiz-wrapper {
  max-width: 45rem;
  .boxes {
    .box {
      margin-top: 0.5rem;
      padding: 1rem;
      background-color: $lightgrey;
      border-radius: 1rem;
      cursor: pointer;
      &:hover {
        background-color: $cloudgrey;
      }
    }
    .selected {
      background-color: $blue;
      color: $white;
      &:hover {
        background-color: $orange;
      }
    }
  }
}
.icon-wrapper {
  width: fit-content;
  background-color: $lightgrey;
  color: $blue;
  margin-left: auto;
  margin-top: 1rem;
  &:hover {
    background-color: $grey;
    box-shadow: $shadow;
    .icon {
      transform: translateX(0.5rem);
      color: $orange;
      opacity: 0.8;
      scale: 1 0.9;
    }
  }
  .icon {
    font-size: 3rem;
  }
}
</style>
