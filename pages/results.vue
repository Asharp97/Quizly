<template>
  <div class="results">
    <participants-table :limit="3" />
    <div class="title">
      <h2>Aggregate Insights</h2>
    </div>

    <div class="box-wrapper">
      <databox
        title="Participants count"
        icon="iconoir:community"
        :number="count" />
      <databox title="Average Score" icon="ic:round-percentage" :number="avg" />
      <databox
        title="Median Score"
        icon="carbon:chart-median"
        :number="median" />
      <databox
        title="Most Missed Question"
        icon="hugeicons:unavailable"
        :number="count" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
const quiz = useQuiz();
const participant = useParticipant();
const stat = stats();

// const score = useScore();
// const question = useQuestion();

const count = ref(0);
const scoreList = ref([]);
const avg = ref();
const median = ref();

// onMounted(async () => {
//   if (quiz.id) {
//     count.value = await participant.getCount(quiz.id);
//     scoreList.value = await participant.getScores(quiz.id);
//     stat.median(scoreList.value);
//   }
// });
watch(
  () => quiz.id,
  async () => {
    if (quiz.id) {
      participant.get(quiz.id);
      count.value = await participant.getCount(quiz.id);
      scoreList.value = await participant.getScores(quiz.id);
      avg.value = stat.avg(scoreList.value);
      median.value = stat.median(scoreList.value);
    }
  }
);
</script>

<style lang="scss" scoped></style>
