<template>
  <div class="sharingkey container">
    <div v-if="!participant.id" class="form-wrapper">
      <h2>{{ quiz.name }}</h2>
      <p v-if="quiz.description">{{ quiz.description }}</p>
      <form action="" class="form">
        <div class="name">
          <input
            v-model="firstName"
            required
            name="First name"
            type="text"
            placeholder="First Name" />
          <input
            v-model="lastName"
            required
            name="Last name"
            type="text"
            placeholder="Last Name" />
        </div>
        <input
          v-model="email"
          required
          name="email"
          type="Email"
          placeholder="Email address"
          @blur="emailCheck" />
        <Transition name="fade">
          <div v-if="emailError" class="errormessage">{{ emailError }}</div>
        </Transition>
      </form>
      <Btn @click="startQuiz">Let's take the quiz</Btn>
    </div>
    <div v-else>
      <div class="quiz-wrapper">
        <h2>{{ question.name }}</h2>
        <div class="boxes">
          <div
            v-for="(ans, n) in answer.list"
            :key="ans.id"
            :class="{ selected: selectedAnswer.includes(n) }"
            class="box"
            @click="selectAnswer(n)">
            <h3>{{ ans.text }}</h3>
          </div>
        </div>
      </div>
      <div class="icon-wrapper" @click="next()">
        <Icon name="material-symbols:chevron-right-rounded" class="icon" />
      </div>
      
    </div>
  </div>
</template>

<script setup>
const id = useRoute().params.id;
// const sharingKey = useRoute().params.sharingKey;
const supabase = useSupabaseClient();
const router = useRouter();
const participant = useParticipant();
const modal = useModal();
const quiz = useQuiz();
const question = useQuestion();
const answer = useAnswers();

const counter = ref(0);
const correct = ref(false);

const firstName = ref("");
const lastName = ref("");
const email = ref("");

const log = console.log;

const startQuiz = async () => {
  if (emailCheck() && notEmpty()) {
    // const { data, error } = await supabase
    //   .from("participants")
    //   .select()
    //   .eq("quiz_id", id)
    //   .eq("email", email.value)
    //   .single();
    // if (data) emailError.value = "Seems like you already took this quiz dude";
    // else {
    const { data, error } = await supabase
      .from("participants")
      .insert({
        name: firstName.value.concat(" ", lastName.value),
        email: email.value,
        quiz_id: id,
      })
      .select();
    if (data) {
      participant.set(data[0]);
      question.get(id);
      question.set(question.list[0]);
      answer.get();
    }
    if (error) log(error);
  }
  // }
};

// participant.reset(); //REMOVE MEEEEEEEEEEEEEEEEEEEEEEEEEE

onMounted(async () => {
  quiz.id = id;
  if (id) {
    await question.get(id);
    question.set(question.list[0]);
    await answer.get();
  }
});

const selectedAnswer = ref([]);

counter.value = 0;

const selectAnswer = (x) => {
  if (selectedAnswer.value.includes(x)) {
    selectedAnswer.value = selectedAnswer.value.filter(
      (answerId) => answerId !== x
    );
  } else {
    selectedAnswer.value.push(x);
  }
};

let correctCount = 0;
const scoreCheck = async () => {
  await answer.get();
  for (let i = 0; i < selectedAnswer.value.length; i++)
    if (answer.list[selectedAnswer.value[i]].is_correct === false) return false;
  correctCount++;
  return true;
};
const showAnswers = ref(false);
let finalQuizScore = 0;
const next = async () => {
  correct.value = await scoreCheck();
  selectedAnswer.value = [];
  if (counter.value < question.list.length - 1) {
    counter.value++;
    question.set(question.list[counter.value]);
    await answer.get();
  } else {
    finalQuizScore = Math.round((correctCount / question.list.length) * 100);
    await submitScore();
    await incrementResponses();

    if (!question.show_result) {
      modal.show = "quizDone";
      router.push("/");
    } else showAnswers.value = true;
  }
};
const submitScore = async () => {
  const { error } = await supabase.from("scores").insert({
    quiz_id: id,
    participant_id: participant.id,
    score: finalQuizScore,
  });
  if (error) log(error);
};

const incrementResponses = async () => {
  const { error } = await supabase.rpc("increment", { row_id: id });
  if (error) log(error);
};

const emailError = ref(null);

const notEmpty = () => {
  if (firstName.value && lastName.value) return true;
  else return false;
};
const emailCheck = () => {
  const { isValid, error } = validateEmail(email.value);
  emailError.value = error;
  return isValid;
};

question.get(quiz.id);

definePageMeta({
  middleware: "verify-quiz",
});
</script>

<style lang="scss" scoped></style>
