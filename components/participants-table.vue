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
          <th>Grade</th>
          <th>Correct/Total</th>
          <th>Time Spent</th>
          <th>Submission Time</th>
        </tr>
        <tr v-for="(part, n) in dataset" :key="part.id">
          <td>{{ n + 1 }}</td>
          <td>{{ part.name }}</td>
          <td>
            <NuxtLink :to="`mailto:${part.email}`" class="link">
              {{ part.email }}
            </NuxtLink>
          </td>
          <td>{{ part.score }}%</td>
          <td>{{ stat.grade(part.score, score) }}</td>
          <td>{{ part.correct_count }}/{{ question.list.length }}</td>
          <td>{{ clockFormate(part.time_spent) }}</td>
          <td>{{ formatDate(part.created_at) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
const prop = defineProps(["dataset", "limit", "score"]);
const participant = useParticipant();
const quiz = useQuiz();
const question = useQuestion();
const stat = stats();

// watch(
//   () => quiz.id,
//   async () => {
//     await participant.getLimited(quiz.id);
//     // else await participant.get(quiz.id)
//     // await question.get(quiz.id);
//   }
// );
</script>

<style lang="scss" scoped></style>
