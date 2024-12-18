<template>
  <div>
    <ol class="container">
      <li v-for="(quest, n) in question.list" :key="quest.id" class="review">
        <h2>{{ n + 1 }}</h2>
        <!-- :selected-answer="scores[n].answer_id" -->
        <quiz-wrapper
          :answer="answerAll[n]"
          :question="quest.text"
          :show-arrows="false"
          :score="scores[n]"
          :review-mode="true"
        />
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

const answerAll = ref([]);
const scores = ref();
const answersIds = ref([]);

const getAnswers = async () => {
  for (let i = 0; i < question.list.length; i++)
    answerAll.value.push(await answer.get(question.list[i].id));
};

const getScores = async () => {
  for (let i = 0; i < question.list.length; i++)
    scores.value.push(await score.get(question.list[i].id, participant.id));
  answersIds.value = scores.value;
};

onMounted(async () => {
  scores.value = [];
  quiz.id = id;
  await question.get(id);
  question.set(question.list[0]);
  await getAnswers();
  await getScores();
});
</script>

<style lang="scss" scoped>
.icon-wrapper {
  font-size: 5rem;
  .true {
    color: green;
  }
  .false {
    color: red;
  }
}
</style>
