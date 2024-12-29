<template>
  <div class="dashboard">
    <div class="quizes-list">
      <div class="top-bar">
        <btn class="newQuizBtn" @click="handlePostQuestion()">
          <div class="icon-wrapper">
            <Icon class="icon" name="material-symbols:add-2-rounded" />
          </div>
          Create New Question
        </btn>
      </div>

      <div v-if="question.list.length && !loading" class="quetion-list">
        <div class="quiz-titles">
          <div />
          <div>Created at</div>
          <div>Question Type</div>
        </div>
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
            <h4>{{ formatDate(exam.created_at) }}</h4>
            <h4 v-if="exam.type == 'mcq'">Multiple Choice</h4>
            <h4 v-if="exam.type == 'tf'">True Or False</h4>
            <h4 v-if="exam.type == 'oe'">Open Ended</h4>
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
              <div v-if="question.type == 'oe'" class="oe">
                <div class="answer-wrapper">
                  <textarea
                    v-model="answer.oe.text"
                    placeholder="Your answer goes here" />
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
                  :icon="
                    loading ? 'line-md:uploading-loop' : 'line-md:uploading'
                  "
                  @click="submitQA()" />
              </div>
            </div>
            <div class="panel">
              <question-type />
              <p v-if="answer.list.length > 7" class="errormessage">
                woah woah take it easy there isn't that too much
              </p>
            </div>
          </div>
        </div>
      </div>
      <Fscreen v-if="!question.list.length && !loading">
        <p class="bg">
          Looks like you're just getting started! No questions here yet.
          <br />
          Click
          <strong>"Create New Question"</strong> to make your first one. 🚀
        </p>
      </Fscreen>
      <Loading v-show="loading" />
    </div>
    <Teleport to="body">
      <ModalComponent :condition="modal.show == 'postQuestion'">
        <div class="modal-content">
          <input
            ref="questionModalInput"
            v-model="question.name"
            type="text"
            placeholder="Question" />
          <question-type :title="false"/>
          <Btn @click="question.post()">Submit Question</Btn>
        </div>
      </ModalComponent>
    </Teleport>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";
import { formatDate } from "~/utils/formatdate";
import { useAnswers } from "../composables/useAnswers.ts";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const modal = useModal();
const quiz = useQuiz();

const loading = ref(false);
const openPanel = ref(true);

//QUESTIONS FUNCTIONS
const question = useQuestion();
const questionMenuRef = ref(null);
const questionModalInput = ref(null);

const handlePostQuestion = async () => {
  question.name = "Question #" + (question.list.length + 1);
  modal.show = "postQuestion";
  // await nextTick();
  // questionModalInput.value.focus();
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

const getQuestions = async () => {
  loading.value = true;
  if (quiz.id) await question.get(quiz.id);
  loading.value = false;
};

onMounted(async () => {
  await getQuestions();
});

watch(
  () => quiz.id,
  async () => {
    await getQuestions();
  }
);
watch(
  () => question.id,
  async () => {
    if (question.id) await answer.get(question.id);
  }
);
</script>

<style lang="scss" scoped>
.qa {
  input {
    margin-bottom: 0;
  }
}
</style>
