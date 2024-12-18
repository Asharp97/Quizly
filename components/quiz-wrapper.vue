<template>
  <div>
    <div class="quiz-wrapper">
      <h2>{{ question }}</h2>
      <div class="boxes">
        <div
          v-for="(ans, n) in answer"
          :key="ans.id"
          :class="[
            { selected: selectedAnswer.includes(n) },
            {
              correct:
                reviewMode && score?.is_correct && selectedAnswer.includes(n),
            },
            {
              incorrect:
                reviewMode && !score?.is_correct && selectedAnswer.includes(n),
            },
          ]"
          class="box"
          @click="$emit('selectAnswer', n)"
        >
          <h3>{{ ans.text }}</h3>
          <div
            v-if="
              reviewMode &&
              (selectedAnswer.includes(n) ||
                (!score?.is_correct && answer[n]?.is_correct))
            "
            class="icon-wrapper"
          >
            <Icon
              :name="
                score?.is_correct || answer[n]?.is_correct
                  ? 'icon-park-solid:correct'
                  : 'fluent-emoji-high-contrast:cross-mark'
              "
              :class="
                score?.is_correct || answer[n]?.is_correct ? 'true' : 'false'
              "
              class="icon"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="showArrows" class="next-wrapper" @click="$emit('next')">
      <Icon name="material-symbols:chevron-right-rounded" class="icon" />
    </div>
  </div>
</template>

<script setup>
defineProps([
  "question",
  "selectedAnswer",
  "answer",
  "showArrows",
  "score",
  "reviewMode",
]);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: $cloudgrey;
      }
      .icon-wrapper {
        background-color: $white;
        .icon {
          font-size: 1rem;
        }
        .true {
          color: green;
        }
        .false {
          color: red;
        }
      }
    }
    .selected {
      background-color: $blue;
      color: $white;
      &:hover {
        background-color: $orange;
      }
    }
    .correct {
      background-color: green;
      color: $white;
      &:hover {
        background-color: green;
      }
    }
    .incorrect {
      background-color: red;
      color: $white;
      &:hover {
        background-color: red;
      }
    }
  }
}
.next-wrapper {
  width: fit-content;
  background-color: $lightgrey;
  color: $blue;
  margin-left: auto;
  border-radius: 0.5rem;
  margin-top: 1rem;
  cursor: pointer;
  .icon {
    font-size: 3rem;
  }
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
