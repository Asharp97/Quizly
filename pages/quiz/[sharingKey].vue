<template>
  <div class="sharingkey container">
    <div v-if="!isLoggedIn" class="form-wrapper">
      <h2>{{ quiz.title }}</h2>
      <p v-if="quiz.description">{{ quiz.description }}</p>
      <AuthForm />
    </div>
    <div v-if="isLoggedIn && !modal.show">
      <count-down
        v-if="quiz.timeLimit && isStart"
        :minutes="quiz.timeLimit"
        @timeup="terminateQuiz()" />
      <quiz-wrapper
        v-if="isStart"
        :selected-answer="selectedAnswer"
        :answer="answerList"
        :question="activeQuestion?.text"
        :show-arrows="true"
        :review-mode="false"
        @next="next"
        @select-answer="selectAnswer" />
      <div v-else>
        <h2 v-if="!isStart">
          Welcome to: <span class="orange">{{ quiz.title }}</span>
        </h2>
        <h4 style="text-align: center; margin-block: 1rem">Are you ready?</h4>
        <Btn @click="startQuiz">let's go!</Btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const modal = useModal();
const Quiz = useQuiz();
const watch = stopWatch();
const session = useSession();
const { isLoggedIn } = storeToRefs(session);
const link = useRoute().params.sharingKey;
const QuizSub = useQuizSubmission();
let quizSub = { id: "" };
const AnswerSub = useAnswerSubmission();
let answerSub = {};

const dash = useDashboardStore();
const { answerList, activeQuestion } = storeToRefs(dash);
const { setActiveQuiz } = dash;

const quizStore = useQuizStore();

const { quiz, participant } = storeToRefs(quizStore);
const isStart = ref(false);

onMounted(async () => {
  if (link) quiz.value = await Quiz.verifyQuiz(link as string);
});

const startQuiz = async () => {
  quizSub = await QuizSub.post({
    Quiz: { connect: { id: quiz.value.id } },
  });
  isStart.value = true;
  if (isLoggedIn) quiz.value = await Quiz.get({ link });
  setActiveQuiz(quiz.value);
  if (quiz.value.timeLimit) watch.start();
};
const next = async () => {
  AnswerSub.post({
    QuizSubmission: { connect: { id: quizSub.id } },
    Question: { connect: { id: activeQuestion.value.id } },
    Answer: {
      connect: { id: selectedAnswer.value[0] },
    },
  });
  const question = await dash.next();
  if (!question) await terminateQuiz();
};
const terminateQuiz = async () => {
  watch.stop();
  isStart.value = false;
  await QuizSub.edit(quizSub.id, {
    submittedAt: { set: new Date().toISOString() },
  });
  navigateTo("/quizEnded");
};
const selectedAnswer = ref<string[]>([]);
const selectAnswer = (id: string) => {
  if (!answerList.value || answerList.value.length === 0) return;
  const answer = answerList.value.find((ans) => ans.id === id);
  if (!answer) return;

  const idx = selectedAnswer.value.indexOf(id);
  if (idx === -1) selectedAnswer.value.push(id);
  else selectedAnswer.value.splice(idx, 1);
};

definePageMeta({
  middleware: "verify-quiz",
});
</script>

<style lang="scss" scoped></style>
