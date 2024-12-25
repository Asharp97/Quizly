<template>
  <div class="results">
    <participants-table
      v-show="list.length && !loading"
      :dataset="list"
      :score="scoreList"
      @order="order"
    />
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
const question = useQuestion();
const participant = useParticipant();

const getList = async () => {
  loading.value = true;
  if (quiz.id) list.value = await participant.get(quiz.id);
  scoreList.value = list.value.map((x) => x.score);
  loading.value = false;
  await question.getCount(quiz.id);
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
const supabase = useSupabaseClient();
const order = async (n, bool) => {
  const { data, error } = await supabase
    .from("participants")
    .select()
    .order(n, { ascending: bool });
  if (data) list.value = data;
  else console.log(error);
};
</script>

<style lang="scss" scoped></style>
