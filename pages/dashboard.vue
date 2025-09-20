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

      <div v-if="quizList.length && !loadingQuizzes" class="quetion-list">
        <div v-if="questionList.length" class="quiz-titles">
          <div />
          <div>Created at</div>
          <div>Question Type</div>
        </div>
        <div v-for="quest in questionList" :key="quest.id" class="quiz-data">
          <div
            class="quiz-header"
            :class="{ active: activeQuestion.id == quest.id }"
            @click="
              setActiveQuestion(quest);
              openPanel = !openPanel;
            ">
            <h3>{{ quest.text }}</h3>
            <h4>{{ formatDate(quest.createdAt) }}</h4>
            <h4 v-if="quest.type == Question_Type.MULTIPLE_CHOICE">
              Multiple Choice
            </h4>
            <h4 v-if="quest.type == Question_Type.TRUE_FALSE">True Or False</h4>
            <h4 v-if="quest.type == Question_Type.SHORT_ANSWER">Open Ended</h4>
            <div class="icon-wrapper dropdown">
              <Icon
                class="icon"
                name="mi:options-horizontal"
                @click="questionMenu = quest.id" />
              <div
                v-if="questionMenu == quest.id"
                ref="questionMenuRef"
                class="menu-bg">
                <div class="menu">
                  <div class="item">Delete quiz</div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="activeQuestion.id == quest.id && openPanel == true"
            class="quiz-content">
            <div class="qa">
              <div class="input-wrapper question">
                <input
                  v-model="activeQuestion.text"
                  type="text"
                  placeholder="Enter Your quesion here" />
              </div>
              <div
                v-if="activeQuestion.type == Question_Type.MULTIPLE_CHOICE"
                class="answer-list">
                <div
                  v-for="(ans, n) in answerList"
                  :key="ans.id"
                  class="answer-wrapper">
                  <div
                    class="input-wrapper answer"
                    :class="{ correct: ans.isCorrect }">
                    <input
                      ref="answerInput"
                      v-model="ans.text"
                      type="text"
                      placeholder="And here is your answer" />
                  </div>
                  <input
                    v-model="ans.isCorrect"
                    class="checkbox"
                    type="checkbox" />

                  <Icon
                    :class="{ disabled: answerList.length == 2 }"
                    name="material-symbols:delete-outline-rounded"
                    class="icon"
                    @click="Answer.del(ans.id, n)" />
                </div>
              </div>
              <div
                v-if="activeQuestion.type == Question_Type.TRUE_FALSE"
                class="tf">
                <div class="answer-wrapper">
                  <div
                    :class="{ correct: quest.trueFalseAnswer }"
                    class="input-wrapper answer">
                    <input disabled value="TRUE" type="text" />
                  </div>
                  <input
                    v-model="quest.trueFalseAnswer"
                    :value="true"
                    name="tf"
                    type="radio" />
                </div>
                <div class="answer-wrapper">
                  <div
                    :class="{ correct: !quest.trueFalseAnswer }"
                    class="input-wrapper answer">
                    <input disabled value="FALSE" type="text" />
                  </div>
                  <input
                    v-model="quest.trueFalseAnswer"
                    :value="false"
                    name="tf"
                    type="radio" />
                </div>
              </div>
              <div
                v-if="activeQuestion.type == Question_Type.SHORT_ANSWER"
                class="oe">
                <div class="answer-wrapper">
                  <!-- todo vmodel textarea -->
                  <textarea placeholder="Your answer goes here" />
                </div>
              </div>
              <div class="button-group">
                <Btn
                  :disabled="
                    answerList.length > maxAnswers ||
                    activeQuestion.type !== Question_Type.MULTIPLE_CHOICE
                  "
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
              <question-type v-model:questionType="activeQuestion.type" />
              <p v-if="answerList.length > maxAnswers" class="errormessage">
                woah woah take it easy there isn't that too much
              </p>
            </div>
          </div>
        </div>
      </div>
      <Fscreen v-if="questionList.length === 0 && !loadingQuestions">
        <p class="bg">
          Looks like you're just getting started! No questions here yet.
          <br />
          Click
          <strong>"Create New Question"</strong> to make your first one. 🚀
        </p>
      </Fscreen>
      <Loading v-show="loadingQuizzes" />
    </div>
    <Teleport to="body">
      <ClientOnly>
        <ModalComponent :condition="modal.show === ModalType.POST_QUESTION">
          <div class="modal-content">
            <input
              ref="questionModalInput"
              v-model="questionForm.text"
              type="text"
              placeholder="Question" />
            <question-type
              :title="false"
              v-model:questionType="questionForm.type" />
            <Btn @click="createQuestion()">Submit Question</Btn>
          </div>
        </ModalComponent>
      </ClientOnly>
    </Teleport>
  </div>
</template>

<script setup>
const dashboard = useDashboardStore();
const {
  quizList,
  questionList,
  answerList,
  activeQuiz,
  activeQuestion,
  loadingQuizzes,
  loadingQuestions,
  loadingAnswers,
} = storeToRefs(dashboard);
const { setActiveQuestion } = dashboard;
import { Question_Type } from "#gql/default";
import { onClickOutside, set } from "@vueuse/core";
import { formatDate } from "~/utils/formatdate";
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const modal = useModal();
const Question = useQuestion();

const loading = ref(false);
const openPanel = ref(true);

//QUESTIONS FUNCTIONS
const questionMenu = ref(null);
const questionMenuRef = ref(null);
const questionModalInput = ref(null);

const questionForm = ref({
  type: Question_Type.MULTIPLE_CHOICE,
  text: "",
  quizId: activeQuiz.value ? activeQuiz.value.id : null,
});

const handlePostQuestion = async () => {
  questionForm.value.text =
    "Question #" +
    (questionList.value.length !== 0 ? questionList.value.length + 1 : 1);
  modal.show = ModalType.POST_QUESTION;
  await nextTick();
  questionModalInput.value.focus();
};
const createQuestion = async () => {
  if (!questionForm.value.text || !questionForm.value.quizId) return;
  loading.value = true;
  const cat = await Question.post(questionForm.value);
  console.log(cat);
  questionForm.value.text = "";
  questionForm.value.type = Question_Type.MULTIPLE_CHOICE;
  loading.value = false;
  modal.close();
};
const maxAnswers = 6;
onClickOutside(questionMenuRef, () => (questionMenu = null));
</script>

<style lang="scss" scoped>
.qa {
  input {
    margin-bottom: 0;
  }
}
</style>
