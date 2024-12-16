<template>
  <div>
    <div class="title">
      <h2>Participants Table</h2>
      <NuxtLink v-if="limit" to="/participants"
        ><btn :provider="true"> View All </btn></NuxtLink
      >
    </div>
    <div class="table-wrapper">
      <table>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Score (%)</th>
          <th>Correct/Total</th>
          <th>Time Spent</th>
          <th>Submission Time</th>
        </tr>
        <tr v-for="(part, n) in participant.list" :key="part.id">
          <td>{{ n + 1 }}</td>
          <td>{{ part.name }}</td>
          <td>
            <a :href="`mailto:${part.email}`" class="link ellipsis">
              {{ part.email }}
            </a>
          </td>
          <td>{{ part.score }}%</td>
          <td>{{ part.correct_count }}/{{ question.list.length }}</td>
          <td>{{ clockFormate(part.time_spent) }}</td>
          <td>{{ formatDate(part.created_at) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["limit"]);
const participant = useParticipant();
const quiz = useQuiz();
const question = useQuestion();
onMounted(async () => {
  await participant.get(quiz.id);
});
watch(
  () => quiz.id,
  async () => {
    await participant.get(quiz.id, props.limit);
    await question.get(quiz.id);
  }
);
</script>

<style lang="scss" scoped></style>
