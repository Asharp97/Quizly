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
            placeholder="First Name"
          />
          <input
            v-model="lastName"
            required
            name="Last name"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          v-model="email"
          required
          name="email"
          type="Email"
          placeholder="Email address"
          @blur="emailCheck"
        />
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
            @click="toggleBox(n)"
          >
            <h3>{{ ans.text }}</h3>
          </div>
        </div>
      </div>
      <div class="icon-wrapper" @click="next()">
        <Icon name="material-symbols:chevron-right-rounded" class="icon" />
      </div>
      selected answers : {{ selectedAnswer }}
      <br />
      is correct answer: {{ correct }}
    </div>
  </div>
</template>

<script setup>
const id = useRoute().params.id;
const sharingKey = useRoute().params.sharingKey;
const supabase = useSupabaseClient();
const participant = useParticipant();

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

participant.reset();

const selectedAnswer = ref([]);

counter.value = 0;

const toggleBox = (id) => {
  if (selectedAnswer.value.includes(id)) {
    selectedAnswer.value = selectedAnswer.value.filter(
      (answerId) => answerId !== id
    );
  } else {
    selectedAnswer.value.push(id);
  }
};

onMounted(async () => {
  if (question.id) {
    await question.get(id);
    await answer.get();
  }
});

const next = async () => {
  if (counter.value < question.list.length) {
    counter.value++;
    question.set(question.list[counter.value]);
    await answer.get();
  } else log("out of bounds");
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
