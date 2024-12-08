<template>
  <div class="dashboard">
    <div class="side-nav">
      <aside class="nav-wrapper">
        <div class="title">
          <h3>Quizzes</h3>
          <div class="icon-wrapper">
            <Icon
              class="icon"
              name="material-symbols:add-2-rounded"
              @click="handlPostQuiz()" />
          </div>
        </div>
        <div class="hr" />
        <div v-if="quiz.list.length == 0">
          <p>no Quizzes yet</p>
        </div>
        <ol class="list">
          <li
            v-for="(ask, n) in quiz.list"
            :key="ask.id"
            class="list-item"
            :class="{ active: quiz.id == ask.id }"
            @click="quiz.id = ask.id">
            <p>
              <span> 0{{ n + 1 }}.</span>
              {{ ask.text }}
            </p>
            <div class="icon-wrapper dropdown">
              <Icon
                class="icon"
                name="mi:options-horizontal"
                @click="quiz.menu = ask.id" />
              <div v-if="quiz.menu == ask.id" ref="quizMenuRef" class="menu-bg">
                <div class="menu">
                  <div class="item" @click="copyQuiz(ask.id)">Copy link</div>
                  <div class="item" @click="handleQuizEditor(ask.id)">
                    Edit title
                  </div>
                  <div class="item" @click="quiz.del(ask.id)">Delete Quiz</div>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </aside>
    </div>
    <div class="quizes-list">
      {{ quiz.id }}
      <btn class="newQuizBtn" @click="handlePostQuestion()">
        <div class="icon-wrapper">
          <Icon class="icon" name="material-symbols:add-2-rounded" />
        </div>
        Create New Question
      </btn>
      <div v-if="question.list.length" class="quiz-titles">
        <div />
        <div>Responses</div>
        <div>Created at</div>
      </div>
      <Fscreen v-if="!question.list.length">
        <p>
          🎉 Looks like you're just getting started! No questions here yet.
          Click
          <strong>"Create New Question"</strong> to make your first one. 🚀
        </p>
      </Fscreen>
      <div v-for="exam in question.list" :key="exam.id" class="quiz-data">
        <div
          class="quiz-header"
          :class="{ active: question.id == exam.id }"
          @click="
            () => {
              if (question.id == exam.id) openPanel = !openPanel;
              else {
                question.set(exam);
                openPanel = true;
              }
            }
          ">
          <h3>{{ exam.text }}</h3>
          <h3 v-if="exam.responses">{{ exam.responses }}</h3>
          <h3 v-else>-</h3>
          <h4>{{ formatDate(exam.created_at) }}</h4>
          <div class="icon-wrapper dropdown">
            <Icon
              class="icon"
              name="mi:options-horizontal"
              @click="question.menu = exam.id" />
            <div
              v-if="question.menu == exam.id"
              ref="questionMenuRef"
              class="menu-bg">
              <div class="menu">
                <div class="item" @click="question.del(exam.id)">
                  Delete quiz
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="question.id == exam.id && openPanel == true"
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
                v-for="(reply, n) in answer.list"
                :key="reply.id"
                class="answer-wrapper">
                {{reply}}
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
                  :class="{ disabled: answer.list.length == 2 }"
                  name="material-symbols:delete-outline-rounded"
                  class="icon"
                  @click="answer.del(reply.id, n)" />
              </div>
            </div>
            <div v-if="question.type == 'tf'" class="tf">
              <div class="answer-wrapper">
                <div
                  class="input-wrapper answer"
                  :class="{ correct: answer.tf.is_correct == true }">
                  <input disabled value="TRUE" type="text" />
                </div>
                <input
                  v-model="answer.tf.is_correct"
                  :value="true"
                  name="tf"
                  type="radio" />
              </div>
              <div class="answer-wrapper">
                <div
                  class="input-wrapper answer"
                  :class="{ correct: answer.tf.is_correct == false }">
                  <input disabled value="FALSE" type="text" />
                </div>
                <input
                  v-model="answer.tf.is_correct"
                  :value="false"
                  name="tf"
                  type="radio" />
              </div>
            </div>
            <div class="button-group">
              <Btn
                :disabled="answer.list.length > 7 || question.type != 'mcq'"
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
            <p v-if="answer.list.length > 7" class="error">
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
          <textarea
            v-show="modal.show == 'postQuiz' || modal.show == 'editQuiz'"
            id="description"
            v-model="quiz.description"
            name="description"
            placeholder="Description" />

          <Btn v-if="modal.show == 'postQuiz'" @click="quiz.post">New Quiz</Btn>
          <Btn v-if="modal.show == 'editQuiz'" @click="quiz.edit"
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
          <Btn v-if="modal.show == 'postQuestion'" @click="question.post()"
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
import { useAnswers } from "../composables/useAnswers.ts";

//composables
// import { useQuiz } from "../composables/useQuiz.ts";
// import { useQuestion } from "../composables/useQuestion.ts";
const log = console.log;

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const copyQuiz = (x) => {
  navigator.clipboard.writeText(
    "http://localhost:3000/quiz/" + x + "/" + quiz.sharingKey
  );
};

const modal = useModal();

const loading = ref(false);
const openPanel = ref(true);

//Quizes FUNCTIONS
const quiz = useQuiz();
const quizMenuRef = ref(null);
const quizModalInput = ref(null);

const getQuizes = async () => {
  loading.value = true;
  await quiz.get();
  loading.value = false;
};

const handlPostQuiz = async () => {
  quiz.name = "Quiz #" + (quiz.list.length + 1);
  modal.show = "postQuiz";
  await nextTick();
  quizModalInput.value.focus();
};

const handleQuizEditor = async (x) => {
  await quiz.get(x);
  modal.show = "editQuiz";
  await nextTick();
  quizModalInput.value.focus();
};

onClickOutside(quizMenuRef, () => (quiz.menu = null));

//QUESTIONS FUNCTIONS
const question = useQuestion();
const questionMenuRef = ref(null);
const questionModalInput = ref(null);

const handlePostQuestion = async () => {
  question.name = "Question #" + (question.list.length + 1);
  modal.show = "postQuestion";
  await nextTick();
  questionModalInput.value.focus();
};

onClickOutside(questionMenuRef, () => (question.menu = null));

// ANSWERS
const answer = useAnswers();

const answerInput = ref(null);

const addAnswer = async () => {
  answer.list.push({ text: "", is_correct: false });
  await nextTick();
  answerInput.value[answerInput.value.length - 1].focus();
};

//BOTH
const submitQA = async () => {
  loading.value = true;
  await question.update();
  await answer.post(question.id);
  await answer.cleanup();
  await question.get(quiz.id);
  loading.value = false;
};

onMounted(async () => {
  await getQuizes();
  if (quiz) {
    if (question.list.length) {
      question.set(question.list[0]);
      await answer.get();
    }
  }
});

watch(
  () => quiz.id,
  async () => {
    await question.get(quiz.id);
    await quiz.get(quiz.id);
  }
);
watch(
  () => question.id,
  async () => {
    if (question.id) {
      await answer.get();
    }
  }
);
watch(
  () => question.type,
  () => {
    if (question.type == "mcq") answer.tf.is_correct = false;
    if (question.type == "tf") answer.reset();
  }
);
</script>

<style lang="scss" scoped>
.qa {
  input {
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
