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
        <ol class="list">
          <li
            v-for="(ask, n) in questions"
            :key="ask.id"
            class="list-item"
            :class="{ active: question.id == ask.id }"
            @click="getQA(ask.id)">
            <p>
              <span> 0{{ n + 1 }}.</span>
              {{ ask.text }}
            </p>
            <div class="icon-wrapper dropdown">
              <Icon
                class="icon"
                name="mi:options-horizontal"
                @click="question.menu = ask.id" />
              <div
                v-if="question.menu == ask.id"
                ref="questionMenuRef"
                class="menu-bg">
                <div class="menu">
                  <div class="item" @click="deleteQuestion(ask.id)">
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
      <Fscreen v-if="noContent">
        <p>
          🎉 Looks like you're just getting started! No quizzes here yet. Click
          <strong>"Create New Quiz"</strong> to make your first one. 🚀
        </p>
      </Fscreen>
      <div
        v-for="exam in quizes"
        :key="exam.id"
        class="quiz-data"
        @click="getQuestions(exam.id)">
        <div
          class="quiz-header"
          :class="{ active: quiz.id == exam.id }"
          @click="
            () => {
              if (quiz.id == exam.id) openPanel = !openPanel;
              else {
                quiz.id = exam.id;
                openPanel = true;
              }
            }
          ">
          <h3>{{ exam.title }}</h3>
          <h3 v-if="exam.responses">{{ exam.responses }}</h3>
          <h3 v-else>-</h3>
          <h4>{{ formatDate(exam.created_at) }}</h4>
          <div class="icon-wrapper dropdown">
            <Icon
              class="icon"
              name="mi:options-horizontal"
              @click="quiz.menu = exam.id" />
            <div v-if="quiz.menu == exam.id" ref="quizMenuRef" class="menu-bg">
              <div class="menu">
                <div class="item" @click="handlequizEditor(exam.id)">
                  Edit title
                </div>
                <div class="item" @click="deleteQuiz(exam.id)">Delete quiz</div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="quiz.id == exam.id && openPanel == true"
          class="quiz-content">
          <div class="qa">
            <div class="input-wrapper question">
              <input
                v-model="question.name"
                type="text"
                placeholder="Enter Your quesion here" />
            </div>
            <div v-if="question.type == 'mcq'" class="answer-list">
              <div
                v-for="reply in answers"
                :key="reply.id"
                class="answer-wrapper">
                <div
                  class="input-wrapper answer"
                  :class="{ correct: reply.is_correct }">
                  <input
                    ref="answerInput"
                    v-model="reply.text"
                    type="text"
                    placeholder="And here is your answer" />
                </div>
                <input
                  v-model="reply.is_correct"
                  class="checkbox"
                  type="checkbox" />

                <Icon
                  :class="{ disabled: answers.length == 2 }"
                  name="material-symbols:delete-outline-rounded"
                  class="icon"
                  @click="deleteAnswer(reply.id)" />
              </div>
            </div>
            <div v-if="question.type == 'tf'" class="tf">
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
                :disabled="answers.length > 7 || question.type != 'mcq'"
                :orange="true"
                text="Add Answer"
                icon="iconify i-material-symbols:add-2-rounded"
                @click="addAnswer()" />
              <Btn
                :loading="loading"
                text="Save"
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
              v-model="question.type"
              name=""
              :class="!question.type ? 'placeholder' : ''">
              <option value="mcq">Multiple Choice</option>
              <option value="tf">True or False</option>
              <option value="text">Open Ended</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <ModalComponent
        :condition="modal.show"
        class="modal"
        @clear-inputs="quiz.name = ''">
        <div class="modal-content">
          <input
            v-show="modal.show == 'postQuiz' || modal.show == 'editQuiz'"
            ref="quizModalInput"
            v-model="quiz.name"
            type="text"
            placeholder="Quiz Title" />
          <Btn v-if="modal.show == 'postQuiz'" @click="postQuiz">New Quiz</Btn>
          <Btn v-if="modal.show == 'editQuiz'" @click="editQuiz"
            >Submit Edit</Btn
          >
          <select
            v-if="modal.show == 'postQuestion'"
            id=""
            v-model="question.type"
            name="">
            <option value="mcq">Multiple Choice</option>
            <option value="tf">True Or False</option>
            <option value="text">Open Ended</option>
          </select>
          <input
            v-show="modal.show == 'postQuestion'"
            ref="questionModalInput"
            v-model="question.name"
            type="text"
            placeholder="Question" />
          <Btn v-if="modal.show == 'postQuestion'" @click="postQuestion()"
            >Submit Question</Btn
          >
        </div>
      </ModalComponent>
    </Teleport>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";
import { formatDate } from "~/utils/formatdate";

import { useQuiz } from "../composables/useQuiz.ts";
import { useQuestion } from "../composables/useQuestion.ts";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
const supabase = useSupabaseClient();
const modal = useModal();
const session = useSession();

const loading = ref(false);
const noContent = ref(false);
const noQuestions = ref(false);
const openPanel = ref(true);

//Quizes FUNCTIONS
const quiz = useQuiz();
const quizes = ref([]);
const quizMenuRef = ref(null);
const quizModalInput = ref(null);

const getQuizes = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase.from("quizes").select();
    if (data.length) {
      quizes.value = data;
      quiz.set(data[0]);
      noContent.value = false;
    } else throw error;
    return data?.[0] || null;
  } catch (e) {
    quizes.value = [];
    console.log("no questions yet", e);
    noContent.value = true;
  } finally {
    loading.value = false;
  }
};
const getQuiz = async (x) => {
  const { data, error } = await supabase.from("quizes").select().eq("id", x);
  if (data) quiz.name = data[0].title;
  else console.log(error);
};
const handlPostQuiz = async () => {
  quiz.name = "Quiz #" + (quizes.value.length + 1);
  modal.show = "postQuiz";
  await nextTick();
  quizModalInput.value.focus();
};
const postQuiz = async () => {
  const { data, error } = await supabase
    .from("quizes")
    .insert({ title: quiz.name, user_id: session.user.id })
    .select();
  if (error) console.log(error);
  else {
    getQuizes();
    modal.close();
    quiz.name = "";
    quiz.id = data[0].id;
  }
};
const deleteQuiz = async (x) => {
  const response = await supabase.from("quizes").delete().eq("id", x);
  if (response.status == 204) {
    const res = await getQuizes();
    quiz.set(res[0]);
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
    .update({ title: quiz.name })
    .eq("id", quiz.id);
  if (error) console.log(error);
  else {
    getQuizes();
    modal.close();
    quiz.name = "";
  }
};
onClickOutside(quizMenuRef, () => (quiz.menu = null));

//QUESTIONS FUNCTIONS
const question = useQuestion();
const questions = ref([]);

const questionMenuRef = ref(null);
const questionModalInput = ref(null);

onClickOutside(questionMenuRef, () => (question.menu = null));

const getQuestions = async (x) => {
  if (x) {
    const { data, error } = await supabase
      .from("questions")
      .select()
      .order("created_at", { ascending: false })
      .eq("quiz_id", x);
    if (data) {
      questions.value = data;
      if (data.length > 0) {
        noQuestions.value = false;
      } else {
        noQuestions.value = true;
        answersReset();
        question.reset();
      }
    } else {
      console.log(error);
    }
  }
};
const getQuestion = async (x) => {
  const { data, error } = await supabase.from("questions").select().eq("id", x);
  if (data) {
    question.set(data[0]);
  } else console.log(error);
  return data?.[0] || null; // Return the first question or null if none is found
};
const handlePostQuestion = async () => {
  question.name = "Question #" + (questions.value.length + 1);
  modal.show = "postQuestion";
  await nextTick();
  questionModalInput.value.focus();
};
const postQuestion = async () => {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      text: question.name,
      quiz_id: quiz.id,
      type: question.type,
    })
    .select();
  if (error) console.log(error);
  else {
    quiz.name = "";
    question.id = data[0].id;
    modal.close();
    getQuestions(quiz.id);
  }
};
const updateQuestion = async () => {
  const { data, error } = await supabase
    .from("questions")
    .upsert({
      id: question.id,
      text: question.name,
      quiz_id: quiz.id,
      type: question.type,
    })
    .select();
  if (error) console.log(error);
  else {
    quiz.name = "";
    question.id = data[0].id;
    modal.close();
    getQuestions(quiz.id);
  }
};
const deleteQuestion = async (x) => {
  const response = await supabase.from("questions").delete().eq("id", x);
  if (response.status == 204) {
    getQuestions(quiz.id);
    quiz.name = "";
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
const answerInput = ref(null);

const tf = ref({
  question_id: question.id,
  is_correct: false,
});

const addAnswer = async () => {
  answers.value.push({ text: "", is_correct: false });
  await nextTick();
  answerInput.value[answerInput.value.length - 1].focus();
};
const removeAnswer = () => {
  answers.value.splice(answers.value.length - 1, 1);
};

const deleteAnswer = async (x) => {
  if (typeof answers.value[x] == "undefined") removeAnswer(x);
  else {
    const response = await supabase.from("answers").delete().eq("id", x);
    if (response.status == 204) getAnswer(question.id);
  }
};

const postAnswer = async () => {
  let query = supabase.from("answers");

  if (question.type == "mcq") {
    const answersWithQuestionId = answers.value.map((answer) => ({
      ...answer,
      question_id: question.id,
    }));

    for (let i = 0; i < answersWithQuestionId.length; i++) {
      const { error } = await query.upsert(answersWithQuestionId[i]);
      if (error) console.log(error);
    }
  }
  if (question.type == "tf") {
    tf.value.question_id = question.id;
    const { data, error } = await query.upsert(tf.value).select();
    tf.value = data[0];
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
    else if (type == "tf") if (data.length == 1) tf.value = data[0];
  } else console.log(error);
};

//BOTH
const getQA = async (x) => {
  if (x) {
    question.id = x;
    await getQuestion(x);
    await getAnswer(x, question.type);
  }
};
const submitQA = async () => {
  loading.value = true;
  if (question.id) await updateQuestion();
  else await postQuestion();
  await postAnswer(question.id);
  await getQuestions(quiz.id);
  loading.value = false;
  await cleanup();
};

const cleanup = async () => {
  const ask = await getQuestion(question.id);
  if (ask.type === "tf") {
    await supabase
      .from("answers")
      .delete()
      .eq("question_id", question.id)
      .not("text", "is", null);
  }
  if (ask.type === "mcq") {
    await supabase
      .from("answers")
      .delete()
      .eq("question_id", question.id)
      .is("text", null);
  }
};
const answersReset = () => {
  answers.value = [
    { text: "", is_correct: "" },
    { text: "", is_correct: "" },
    { text: "", is_correct: "" },
  ];
};

onMounted(async () => {
  const res = await getQuizes();
  if (res) {
    await getQuestions(quiz.id);
    if (questions.value.length) {
      question.set(questions.value[0]);
      await getAnswer(question.id, question.type);
    }
  }
});

watch(
  () => quiz.id,
  () => {
    getQuestions(quiz.id);
  }
);
watch(
  () => question.type,
  () => {
    if (question.type == "mcq") tf.value.is_correct = false;
    if (question.type == "tf") answersReset();
  }
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
