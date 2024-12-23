<template>
  <div class="results">
    <participants-table
      v-show="list.length && !loading"
      :dataset="list"
      :score="scoreList" />
    <Loading v-show="loading" />
    <Fscreen v-show="!list.length && !loading">
      <h2>No participants yet <Icon name="solar:sad-square-outline" /></h2>
    </Fscreen>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const list = ref([]);
const loading = ref(false);
const scoreList = ref([]);
const quiz = useQuiz();
const participant = useParticipant();

const getList = async () => {
  loading.value = true;
  if (quiz.id) list.value = await participant.get(quiz.id);
  scoreList.value = list.value.map((x) => x.score);
  loading.value = false;
};

onMounted(async () => {
  await getList();
});

watch(
  () => quiz.id,
  async () => {
    await getList();
  }
);
</script>

<style lang="scss" scoped></style>
