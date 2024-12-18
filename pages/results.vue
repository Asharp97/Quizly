<template>
  <div class="results">
    <participants-table :data="participant.list" />
    <div class="title">
      <h2>Aggregate Insights</h2>
    </div>
    <div class="box-wrapper">
      <databox
        title="Participants count"
        icon="iconoir:community"
        :number="count"
      />
      <databox title="Average Score" icon="ic:round-percentage" :number="avg" />
      <databox
        title="Median Score"
        icon="carbon:chart-median"
        :number="median"
      />
      <!-- <databox
        title="Most Missed Question"
        icon="hugeicons:unavailable"
        :number="mostMissed" /> -->
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

const score = useScore();
const question = useQuestion();

const sth = ref([]);

const count = ref(0);
const scoreList = ref([]);
const avg = ref();
const median = ref();
const mostMissed = ref();

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
    sth.value = [];
    if (quiz.id) {
      // await participant.getLimited(quiz.id);
      count.value = await participant.getCount(quiz.id);
      scoreList.value = await participant.getScores(quiz.id);
      avg.value = stat.avg(scoreList.value);
      median.value = stat.median(scoreList.value);
      await question.get(quiz.id);

      // mostMissed.value = await score.mostMissed(quiz.id);
    }
  }
);
</script>

<style lang="scss" scoped></style>
