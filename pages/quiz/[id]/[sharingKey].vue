<template>
  <div class="container">
    <div>the id is {{ id }} - {{ sharingKey }}</div>
    <div v-if="quiz">
      <form action="">form</form>
      {{ quiz.name }}
      {{ quiz.id }}
    </div>
    <div v-else>no such link i guess</div>
  </div>
</template>

<script setup>
const id = useRoute().params.id;
const sharingKey = useRoute().params.sharingKey;
// const supabase = useSupabaseClient();
const quiz = useQuiz();

definePageMeta({
  middleware: "verify-quiz",
});

// const verify = async () => {
//   const { data, error } = await supabase
//     .from("quizes")
//     .select()
//     .eq("sharing_key", sharingKey)
//     .single();
//   if (data) {
//     isFormVisible.value = true;
//     quiz.value = data;
//   }
// };

// onMounted(async () => {
//   verify();
// });
</script>

<style lang="scss" scoped></style>
