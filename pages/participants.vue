<template>
  <div class="results">
    <!-- @order="order" -->
    <!-- :score="scoreList" -->
    <participants-table v-show="list.length && !loading" :dataset="list" />
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
const Quiz = useQuiz();
const QuizSubmissions = useQuizSubmissions();

const getList = async () => {
  loading.value = true;
  const list = await QuizSubmissions.getParticipants(quiz.id);
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
