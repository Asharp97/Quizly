<template>
  <div>
    <ol class="container">
      <li v-for="(quest, n) in question.list" :key="quest.id" class="review">
        <h2>{{ n + 1 }}</h2>
        <quiz-wrapper
          :selected-answer="selectedAnswer"
          :answer="answerAll[n]"
          :question="quest.text"
          :show-arrows="false"
          @next="next"
          @select-answer="selectAnswer" />
      </li>
    </ol>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "review",
});
const id = useRoute().params.id;

const quiz = useQuiz();
const score = useScore();
const question = useQuestion();
const answer = useAnswers();
const participant = useParticipant();

const selectedAnswer = ref([]);
const answerAll = ref([]);
const scores = ref();

const selectAnswer = () => {};

const getAnswers = async () => {
  for (let i = 0; i < question.list.length; i++)
    answerAll.value.push(await answer.get(question.list[i].id));
};

onMounted(async () => {
  scores.value=[]
  quiz.id = id;
  await question.get(id);
  question.set(question.list[0]);
  await getAnswers();
  for (let i = 0; i < question.list.length; i++)
    scores.value.push(await score.get(question.list[i].id, participant.id));
});
</script>

<style lang="scss" scoped></style>
