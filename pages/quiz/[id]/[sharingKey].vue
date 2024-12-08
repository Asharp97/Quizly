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
            @click="toggleBox(n)"
            :class="{ selected: selectedAnswer.includes(ans.id) }"
            class="box">
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
const sharingKey = useRoute().params.sharingKey;
const supabase = useSupabaseClient();
const participant = useParticipant();

const quiz = useQuiz();
const question = useQuestion();
const answer = useAnswers();

const n = ref(0);

const firstName = ref("");
const lastName = ref("");
const email = ref("");

const log = console.log;

const startQuiz = async () => {
  if (emailCheck() && notEmpty()) {
    const { data, error } = await supabase
      .from("participants")
      .select()
      .eq("quiz_id", id)
      .eq("email", email.value)
      .single();
    if (data) emailError.value = "Seems like you already took this quiz dude";
    else {
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
        answer.get(question.id);
      }
      if (error) log(error);
    }
  }
};

const selectedAnswer = ref([]);

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
    await answer.get(question.id);
  }
});

const next = async () => {
  n.value++;
  question.set(question.list[n.value]);
  await answer.get(question.id);
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
