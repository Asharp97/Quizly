<template>
  <div class="dashboard">
    <div class="side-nav">
      <aside class="nav-wrapper">
        <div class="title">
          <h3>Questions</h3>
          <div class="icon-wrapper">
            <Icon
              class="icon"
              name="material-symbols:add-2-rounded"
              @click="handlePostQuestion()" />
          </div>
        </div>
        <div class="hr" />
        <div v-if="noQuestions">
          <p>no questions yet</p>
        </div>
        <!-- {{ questions.length }} -->
        <ol class="list">
          <li
            v-for="(question, n) in questions"
            :key="question.id"
            class="list-item"
            :class="{ active: activeQuestion == question.id }"
            @click="getQA(question.id)">
            <p>
              <span> 0{{ n + 1 }}.</span>
              {{ question.text }}
            </p>
            <div class="icon-wrapper dropdown">
              <Icon
                class="icon"
                name="mi:options-horizontal"
                @click="questionMenu = question.id" />
              <div
                v-if="questionMenu == question.id"
                ref="questionMenuRef"
                class="menu-bg">
                <div class="menu">
                  <div class="item" @click="deleteQuestion(question.id)">
                    Delete question
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </aside>
    </div>
    <div class="quizes-list">
      <btn class="newQuizBtn" @click="handlPostQuiz()">
        <div class="icon-wrapper">
          <Icon class="icon" name="material-symbols:add-2-rounded" />
        </div>
        <p>Create New Quiz</p>
      </btn>
      <div v-if="quizes.length" class="quiz-titles">
        <div />
        <div>Responses</div>
        <div>Created at</div>
      </div>
      <no-content v-if="noContent || loading">
        <p v-if="!quizes.length">
          🎉 Looks like you're just getting started! No quizzes here yet. Click
          <strong>"Create New Quiz"</strong> to make your first one. 🚀
        </p>
        <div v-if="loading" class="icon-wrapper loading">
          <Icon name="eos-icons:bubble-loading" class="icon" />
        </div>
      </no-content>
      <div
        v-for="quiz in quizes"
        :key="quiz.id"
        class="quiz-data"
        @click="getQuestions(quiz.id)">
        <div
          class="quiz-header"
          :class="{ active: activeQuiz == quiz.id }"
          @click="activeQuiz = quiz.id">
          <h3>{{ quiz.title }}</h3>
          <h3 v-if="quiz.responses">{{ quiz.responses }}</h3>
          <h3 v-else>-</h3>
          <h4>{{ formatDate(quiz.created_at) }}</h4>
          <div class="icon-wrapper dropdown">
            <Icon
              class="icon"
              name="mi:options-horizontal"
              @click="quizMenu = quiz.id" />
            <div v-if="quizMenu == quiz.id" ref="quizMenuRef" class="menu-bg">
              <div class="menu">
                <div class="item" @click="handlequizEditor(quiz.id)">
                  Edit title
                </div>
                <div class="item" @click="deleteQuiz(quiz.id)">Delete quiz</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeQuiz == quiz.id" class="quiz-content">
          <div class="qa">
            <div class="input-wrapper question">
              <input
                v-model="questionName"
                type="text"
                placeholder="Enter Your quesion here" />
            </div>
            <div v-if="questionType == 'mcq'" class="answer-list">
              <div
                v-for="answer in answers"
                :key="answer.id"
                class="answer-wrapper">
                <div
                  class="input-wrapper answer"
                  :class="{ correct: answer.is_correct }">
                  <input
                    v-model="answer.text"
                    type="text"
                    placeholder="And here is your answer" />
                </div>
                <input
                  v-model="answer.is_correct"
                  class="checkbox"
                  type="checkbox" />

                <Icon
                  :class="{ disabled: answers.length == 2 }"
                  name="material-symbols:delete-outline-rounded"
                  class="icon"
                  @click="deleteAnswer(answer.id)" />
              </div>
            </div>
            <div v-if="questionType == 'tf'" class="tf">
              <div class="answer-wrapper">
                <div
                  class="input-wrapper answer"
                  :class="{ correct: tf.is_correct == true }">
                  <input
                    disabled
                    value="TRUE"
                    type="text"
                    placeholder="And here is your answer" />
                </div>
                <input
                  v-model="tf.is_correct"
                  :value="true"
                  name="tf"
                  type="radio" />
              </div>
              <div class="answer-wrapper">
                <div
                  class="input-wrapper answer"
                  :class="{ correct: tf.is_correct == false }">
                  <input
                    disabled
                    value="FALSE"
                    type="text"
                    placeholder="And here is your answer" />
                </div>
                <input
                  v-model="tf.is_correct"
                  :value="false"
                  name="tf"
                  type="radio" />
              </div>
            </div>
            <div class="button-group">
              <Btn
                :disabled="answers.length > 7 || questionType != 'mcq'"
                :orange="true"
                text="Add Answer"
                icon="iconify i-material-symbols:add-2-rounded"
                @click="addAnswer()" />
              <Btn
                :loading="loading"
                text="Update"
                :icon="loading ? 'line-md:uploading-loop' : 'line-md:uploading'"
                @click="submitQA()" />
            </div>
          </div>
          <div class="panel">
            <p v-if="answers.length > 7" class="error">
              woah woah take it easy there isn't that too much
            </p>
            <select
              id=""
              v-model="questionType"
              name=""
              :class="!questionType ? 'placeholder' : ''">
              <option value="mcq">Multiple Choice</option>
              <option value="tf">True or False</option>
              <option value="text">Open Ended</option>
            </select>
          </div>
        </div>
      </div>
      <Teleport to="body">
        <ModalComponent
          :condition="modal.show"
          class="modal"
          @clear-inputs="clearInputs()">
          <div class="modal-content">
            <input
              v-show="modal.show == 'postQuiz' || modal.show == 'editQuiz'"
              ref="quizModalInput"
              v-model="quizName"
              type="text"
              placeholder="Quiz Title" />
            <Btn v-if="modal.show == 'postQuiz'" @click="postQuiz"
              >New Quiz</Btn
            >
            <Btn v-if="modal.show == 'editQuiz'" @click="editQuiz"
              >Submit Edit</Btn
            >
            <select
              v-if="modal.show == 'postQuestion'"
              id=""
              v-model="questionType"
              name="">
              <option value="mcq">Multiple Choice</option>
              <option value="tf">True Or False</option>
              <option value="text">Open Ended</option>
            </select>
            <input
              v-show="modal.show == 'postQuestion'"
              ref="questionModalInput"
              v-model="questionName"
              type="text"
              placeholder="Question" />
            <Btn v-if="modal.show == 'postQuestion'" @click="postQuestion()"
              >Submit Question</Btn
            >
          </div>
        </ModalComponent>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";
import { formatDate } from "~/utils/formatdate";
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
const supabase = useSupabaseClient();
const modal = useModal();
const session = useSession();

const loading = ref(false);
const noContent = ref(false);

const clearInputs = () => (quizName.value = "");

//Quizes FUNCTIONS
const quizes = ref([]);
const activeQuiz = ref();
const quizName = ref();
const quizMenu = ref(null);
const quizMenuRef = ref(null);
const quizModalInput = ref(null);

const getQuizes = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase.from("quizes").select();
    if (data) {
      quizes.value = data;
      activeQuiz.value = quizes.value[0].id;
      if (!quizes.value.length) noContent.value = true;
    } else throw error;
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};
const getQuiz = async (x) => {
  const { data, error } = await supabase.from("quizes").select().eq("id", x);
  if (data) quizName.value = data[0].title;
  else console.log(error);
};
const handlPostQuiz = async () => {
  quizName.value = "Quiz #" + (quizes.value.length + 1);
  modal.show = "postQuiz";
  await nextTick();
  quizModalInput.value.focus();
};
const postQuiz = async () => {
  const { error } = await supabase
    .from("quizes")
    .insert({ title: quizName.value, user_id: session.user.id });
  if (error) console.log(error);
  else {
    getQuizes();
    modal.close();
    quizName.value = "";
  }
};
const deleteQuiz = async (x) => {
  const response = await supabase.from("quizes").delete().eq("id", x);
  if (response.status == 204) {
    getQuizes();
    modal.close();
  }
};
const handlequizEditor = async (x) => {
  await getQuiz(x);
  modal.show = "editQuiz";
  await nextTick();
  quizModalInput.value.focus();
};
const editQuiz = async () => {
  const { error } = await supabase
    .from("quizes")
    .update({ title: quizName.value })
    .eq("id", activeQuiz.value);
  if (error) console.log(error);
  else {
    getQuizes();
    modal.close();
    quizName.value = "";
  }
};
onClickOutside(quizMenuRef, () => (quizMenu.value = null));

//QUESTIONS FUNCTIONS
const questions = ref([]);
const activeQuestion = ref();
const questionMenu = ref(null);
const questionMenuRef = ref(null);
const questionModalInput = ref(null);

const questionName = ref();
const noQuestions = ref(false);
const questionType = ref("mcq");

onClickOutside(questionMenuRef, () => (questionMenu.value = null));

const getQuestions = async (x) => {
  const { data, error } = await supabase
    .from("questions")
    .select()
    .order("created_at", { ascending: false })
    .eq("quiz_id", x);
  if (data) {
    if (data.length > 0) {
      questions.value = data;
      noQuestions.value = false;
    } else noQuestions.value = true;
  } else console.log(error);
};
const getQuestion = async (x) => {
  const { data, error } = await supabase.from("questions").select().eq("id", x);
  if (data) {
    if (data.length) {
      questionName.value = data[0].text;
      questionType.value = data[0].type;
      return data.type;
    }
  } else console.log(error);
};
const handlePostQuestion = async () => {
  questionName.value = "Question #" + (questions.value.length + 1);
  modal.show = "postQuestion";
  await nextTick();
  questionModalInput.value.focus();
};
const postQuestion = async () => {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      text: questionName.value,
      quiz_id: activeQuiz.value,
      type: questionType.value,
    })
    .select();
  if (error) console.log(error);
  else {
    quizName.value = "";
    activeQuestion.value = data[0].id;
    modal.close();
    getQuestions(activeQuiz.value);
  }
};
const updateQuestion = async () => {
  const { data, error } = await supabase
    .from("questions")
    .upsert({
      id: activeQuestion.value,
      text: questionName.value,
      quiz_id: activeQuiz.value,
      type: questionType.value,
    })
    .select();
  if (error) console.log(error);
  else {
    quizName.value = "";
    activeQuestion.value = data[0].id;
    modal.close();
    getQuestions(activeQuiz.value);
  }
};
const deleteQuestion = async (x) => {
  const response = await supabase.from("questions").delete().eq("id", x);
  if (response.status == 204) {
    getQuestions(activeQuiz.value);
    quizName.value = "";
  }
};

// ANSWERS
const answers = ref([
  {
    text: "",
    is_correct: false,
  },
  {
    text: "",
    is_correct: false,
  },
  {
    text: "",
    is_correct: false,
  },
]);
const answersReset = () => {
  answers.value = [
    {
      text: "",
      is_correct: false,
    },
    {
      text: "",
      is_correct: false,
    },
    {
      text: "",
      is_correct: false,
    },
  ];
};
const tf = ref({
  question_id: activeQuestion.value,
  is_correct: false,
});

const addAnswer = () => {
  answers.value.push({ text: "", is_correct: false });
};
const removeAnswer = () => {
  answers.value.splice(answers.value.length - 1, 1);
};

const deleteAnswer = async (x) => {
  if (typeof answers.value == "undefined") removeAnswer(x);
  else {
    const response = await supabase.from("answers").delete().eq("id", x);
    if (response.status == 204) getAnswer(activeQuestion.value);
  }
};

const postAnswer = async () => {
  let query = supabase.from("answers");

  if (questionType.value == "mcq") {
    const answersWithQuestionId = answers.value.map((answer) => ({
      ...answer,
      question_id: activeQuestion.value,
    }));

    for (let i = 0; i < answersWithQuestionId.length; i++) {
      const { error } = await query.upsert(answersWithQuestionId[i]);
      if (error) console.log(error);
    }
  }
  if (questionType.value == "tf") {
    tf.value.question_id = activeQuestion.value;
    const { error } = await query.upsert(tf.value);
    if (error) console.log(error);
  }
};
const getAnswer = async (questionId, type) => {
  const { data, error } = await supabase
    .from("answers")
    .select()
    .eq("question_id", questionId);
  if (data) {
    if (type == "mcq")
      if (data.length >= 2) answers.value = data;
      else answersReset();
    else if (type == "tf") tf.value = data[0];
  } else console.log(error);
  console.log(data);
};

//BOTH
const getQA = async (x) => {
  activeQuestion.value = x;
  await getQuestion(x);
  await getAnswer(x, questionType.value);
};
const submitQA = async () => {
  loading.value = true;
  await updateQuestion();
  await postAnswer(activeQuestion.value);
  await getQuestions(activeQuiz.value);
  loading.value = false;
};

onMounted(async () => {
  await getQuizes();
  await getQuestions(activeQuiz.value);
  activeQuestion.value = questions.value[0].id;
  questionName.value = questions.value[0].text;
  questionType.value = questions.value[0].type;
  await getAnswer(activeQuestion.value, questionType.value);
});

watch(
  () => activeQuiz.value,
  () => getQuestions(activeQuiz.value)
);
</script>

<style lang="scss" scoped>
.qa {
  input {
    // background-color: transparent;
    // border: none;
    margin-bottom: 0;
  }
}
.loading {
  .icon {
    font-size: 4rem;
    color: $blue;
  }
}
</style>
