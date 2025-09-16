<template>
  <div>
    <div class="title">
      <h2>Participants Table</h2>
      <NuxtLink v-if="limit" to="/participants"
        ><btn :provider="true"> View All </btn></NuxtLink
      >
      <div v-else class="icon-wrapper" @click="participant.get(quiz.id)">
        <Icon name="material-symbols:refresh-rounded" />
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <tbody>
          <tr>
            <th>#</th>
            <th
              :class="{ 'active-order': col == 'name' }"
              @click="order('name')">
              <span>
                Name
                <div v-if="!limit" class="icon-wrapper">
                  <Icon
                    class="icon"
                    :class="{ flip: bool && col == 'name' }"
                    name="material-symbols-light:arrow-drop-down-rounded" />
                </div>
              </span>
            </th>
            <th>Email</th>
            <th
              :class="{ 'active-order': col == 'score' }"
              @click="order('score')">
              <span>
                Score (%)
                <div v-if="!limit" class="icon-wrapper">
                  <Icon
                    class="icon"
                    :class="{ flip: bool && col == 'score' }"
                    name="material-symbols-light:arrow-drop-down-rounded" />
                </div>
              </span>
            </th>
            <th>Grade</th>
            <th
              :class="{ 'active-order': col == 'correct_count' }"
              @click="order('correct_count')">
              <span>
                Correct/Total
                <div v-if="!limit" class="icon-wrapper">
                  <Icon
                    class="icon"
                    :class="{ flip: bool && col == 'correct_count' }"
                    name="material-symbols-light:arrow-drop-down-rounded" />
                </div>
              </span>
            </th>
            <th
              :class="{ 'active-order': col == 'time_spent' }"
              @click="order('time_spent')">
              <span>
                Time Spent
                <div v-if="!limit" class="icon-wrapper">
                  <Icon
                    class="icon"
                    :class="{ flip: bool && col == 'time_spent' }"
                    name="material-symbols-light:arrow-drop-down-rounded" /></div
              ></span>
            </th>
            <th
              :class="{ 'active-order': col == 'created_at' }"
              @click="order('created_at')">
              <span>
                Submission Time
                <div v-if="!limit" class="icon-wrapper">
                  <Icon
                    class="icon"
                    :class="{ flip: bool && col == 'created_at' }"
                    name="material-symbols-light:arrow-drop-down-rounded" /></div
              ></span>
            </th>
          </tr>
          <tr v-for="(part, n) in dataset" :key="part.id">
            <td>{{ n + 1 }}</td>
            <td>{{ part.name }}</td>
            <td class="email">
              <NuxtLink :to="`mailto:${part.email}`" class="link">
                {{ part.email }}
              </NuxtLink>
            </td>
            <td>{{ part.score }}%</td>
            <td>{{ stat.grade(part.score, score) }}</td>
            <td>{{ part.correct_count }}/{{ question.amount }}</td>
            <td>{{ clockFormate(part.time_spent) }}</td>
            <td>{{ formatDate(part.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const prop = defineProps(["dataset", "limit", "score"]);
const emit = defineEmits(["order"]);
const participant = useParticipant();
const quiz = useQuiz();
const question = useQuestion();
const stat = stats();

const bool = ref(false);
const col = ref("");
function order(n) {
  bool.value = !bool.value;
  col.value = n;
  emit("order", n, bool.value);
}
</script>

<style lang="scss" scoped></style>
