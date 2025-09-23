<template>
  <!-- Quiz participation page, handles both guest and logged-in user flows -->
  <div class="sharingkey container">
    <!-- Show login form if user is not logged in -->
    <div v-if="!isLoggedIn" class="form-wrapper">
      <h2>{{ quiz.title }}</h2>
      <p v-if="quiz.description">{{ quiz.description }}</p>
      <AuthForm />
    </div>
    <!-- Main quiz interface for logged-in users -->
    <div v-if="isLoggedIn && !modal.show">
      <!-- Countdown timer if quiz has a time limit and has started -->
      <count-down
        v-if="quiz.timeLimit && isStart"
        :minutes="quiz.timeLimit"
        @timeup="terminateQuiz()" />
      <!-- Quiz question/answer wrapper -->
      <quiz-wrapper
        v-if="isStart"
        :selected-answer="selectedAnswer"
        :answer="answerList"
        :question="activeQuestion?.text"
        :show-arrows="true"
        :review-mode="false"
        @next="next"
        @select-answer="selectAnswer" />
      <!-- Pre-quiz welcome screen -->
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
// Import required composables and stores
const modal = useModal(); // Controls modal visibility
const Quiz = useQuiz(); // Quiz logic and API
const watch = stopWatch(); // Timer for quiz
const session = useSession(); // User session
const { isLoggedIn } = storeToRefs(session); // Reactive login state
const link = useRoute().params.sharingKey; // Quiz sharing key from route
const QuizSub = useQuizSubmission(); // Handles quiz submission
let quizSub = { id: "" }; // Stores current quiz submission
const AnswerSub = useAnswerSubmission(); // Handles answer submission
let answerSub = {}; // Stores current answer submission

const dash = useDashboardStore(); // Dashboard store for quiz state
const { answerList, activeQuestion } = storeToRefs(dash); // Current answers and question
const { setActiveQuiz } = dash; // Sets active quiz in dashboard

const quizStore = useQuizStore(); // Quiz store for quiz and participant info
const { quiz, participant } = storeToRefs(quizStore); // Reactive quiz and participant
const isStart = ref(false); // Tracks if quiz has started

// On mount, verify quiz using sharing key
onMounted(async () => {
  if (link) quiz.value = await Quiz.verifyQuiz(link as string);
});

// Starts the quiz, creates a submission, fetches quiz, and starts timer if needed
const startQuiz = async () => {
  quizSub = await QuizSub.post({
    Quiz: { connect: { id: quiz.value.id } },
  });
  isStart.value = true;
  if (isLoggedIn)
    quiz.value = await Quiz.get({ link: Array.isArray(link) ? link[0] : link });
  setActiveQuiz(quiz.value);
  if (quiz.value.timeLimit) watch.start();
};

// Submits answer and moves to next question, terminates quiz if no more questions
const next = async () => {
  if (!activeQuestion.value) return;
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

// Terminates quiz, stops timer, marks submission as complete, navigates to end page
const terminateQuiz = async () => {
  watch.stop();
  isStart.value = false;
  await QuizSub.edit(quizSub.id, {
    submittedAt: { set: new Date().toISOString() },
  });
  navigateTo("/quizEnded");
};

// Tracks selected answers for current question
const selectedAnswer = ref<string[]>([]);
// Handles answer selection/deselection
const selectAnswer = (id: string) => {
  if (!answerList.value || answerList.value.length === 0) return;
  const answer = answerList.value.find((ans) => ans.id === id);
  if (!answer) return;

  const idx = selectedAnswer.value.indexOf(id);
  if (idx === -1) selectedAnswer.value.push(id);
  else selectedAnswer.value.splice(idx, 1);
};

// Page meta: applies verify-quiz middleware for route protection
definePageMeta({
  middleware: "verify-quiz",
});
</script>

<style lang="scss" scoped></style>
