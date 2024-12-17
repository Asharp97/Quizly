<template>
  <div class="sharingkey container">
    <div v-if="!participant.credStore" class="form-wrapper">
      <h2>{{ quiz.name }}</h2>
      <p v-if="quiz.description">{{ quiz.description }}</p>
      <form action="" class="form">
        <div class="name">
          <div class="input-wrapper">
            <input
              v-model="participant.firstName"
              required
              name="First name"
              type="text"
              placeholder="First Name"
              @blur="
                firstNameErr = notEmpty(participant.firstName, 'First Name')
              " />
            <Transition name="fade">
              <div v-if="firstNameErr" class="errormessage">
                {{ firstNameErr }}
              </div>
            </Transition>
          </div>
          <div class="input-wrapper">
            <input
              v-model="participant.lastName"
              required
              name="Last name"
              type="text"
              placeholder="Last Name"
              @blur="
                lasttNameErr = notEmpty(participant.lastName, 'First Name')
              " />
            <Transition name="fade">
              <div v-if="lasttNameErr" class="errormessage">
                {{ lasttNameErr }}
              </div>
            </Transition>
          </div>
        </div>
        <input
          v-model="participant.email"
          required
          name="email"
          type="Email"
          placeholder="Email address"
          @keyup.enter="startQuiz"
          @blur="emailCheck" />
        <Transition name="fade">
          <div v-if="participant.emailError" class="errormessage">
            {{ participant.emailError }}
          </div>
        </Transition>
      </form>
      <Btn @click="startQuiz">Let's take the quiz</Btn>
    </div>
    <div v-else>
      <count-down
        v-if="quiz.time"
        :minutes="quiz.time"
        @timeup="terminateQuiz()" />
      <quiz-wrapper
        :selected-answer="selectedAnswer"
        :answer="answer.list"
        :question="question.name"
        :show-arrows="true"
        @next="next"
        @select-answer="selectAnswer" />
    </div>
  </div>
</template>

<script setup>
import { validateEmail, notEmpty } from "@/utils/validations";
const id = useRoute().params.id;
// const sharingKey = useRoute().params.sharingKey;
const router = useRouter();
const participant = useParticipant();
const modal = useModal();
const quiz = useQuiz();
const question = useQuestion();
const answer = useAnswers();
const score = useScore();
const watch = stopWatch();

const firstNameErr = ref("");
const lasttNameErr = ref("");

const log = console.log;

onMounted(async () => {
  quiz.id = id;
  if (id) {
    await question.get(id);
    question.set(question.list[0]);
    await answer.get(question.id);
  }
});

const selectedAnswer = ref([]);
const counter = ref(0);
const correct = ref(false);
const showAnswers = ref(false);

const startQuiz = async () => {
  firstNameErr.value = notEmpty(participant.firstName, "First Name");
  lasttNameErr.value = notEmpty(participant.lastName, "Last Name");

  if (emailCheck() && participant.firstName && participant.lastName)
    if (await participant.hasTakenQuiz()) {
      participant.credStore = true;
      watch.start();
    }
};

const selectAnswer = (x) => {
  if (selectedAnswer.value.includes(x)) {
    selectedAnswer.value = selectedAnswer.value.filter(
      (answerId) => answerId !== x
    );
  } else {
    selectedAnswer.value.push(x);
  }
};

const scoreCheck = async () => {
  await answer.get(question.id);
  for (let i = 0; i < selectedAnswer.value.length; i++)
    if (answer.list[selectedAnswer.value[i]].is_correct === false) return false;
  participant.correctCount++;
  return true;
};
const next = async () => {
  correct.value = await scoreCheck();
  score.submissions.push({
    question_id: question.id,
    answer_id: selectedAnswer.value,
    is_correct: correct.value,
  });
  selectedAnswer.value = [];
  if (counter.value < question.list.length - 1) {
    counter.value++;
    question.set(question.list[counter.value]);
    await answer.get(question.id);
  } else {
    await terminateQuiz();
  }
};

const terminateQuiz = async () => {
  participant.score = Math.round(
    (participant.correctCount / question.list.length) * 100
  );
  participant.timeSpent = watch.stop();
  await participant.post();
  await participant.incrementResponses();

  score.submissions = score.submissions.map((x) => ({
    ...x,
    participant_id: participant.id,
    quiz_id: quiz.id,
  }));

  for (let i = 0; i < score.submissions.length; i++) {
    score.post(score.submissions[i]);
  }
  score.reset();

  if (!quiz.show_result) {
    modal.show = "quizDone";
    router.push("/");
  } else router.push(`/quiz/${id}/review`);
};

const emailCheck = () => {
  const { isValid, error } = validateEmail(participant.email);
  participant.emailError = error;
  return isValid;
};

definePageMeta({
  middleware: "verify-quiz",
});
</script>

<style lang="scss" scoped></style>
