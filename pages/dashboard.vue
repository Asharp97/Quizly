<template>
  <!-- Dashboard page for managing quizzes and questions -->
  <div class="dashboard">
    <div class="quizes-list">
      <!-- Top bar with button to create a new question -->
      <div class="top-bar">
        <btn
          data-testid="create-question-button"
          class="newQuizBtn"
          @click="postQuestionHandler()">
          <div class="icon-wrapper">
            <Icon class="icon" name="material-symbols:add-2-rounded" />
          </div>
          Create New Question
        </btn>
      </div>
      <div v-if="quizList.length && !loadingQuizzes" class="quetion-list">
        <!-- Table headers for questions -->
        <div v-if="questionList.length" class="quiz-titles">
          <div />
          <div>Created at</div>
          <div>Question Type</div>
        </div>
        <div v-for="quest in questionList" :key="quest.id" class="quiz-data">
          <!-- Question header, shows question text and type, allows selection -->
          <div
            class="quiz-header"
            :class="{ active: activeQuestion.id == quest.id }"
            @click="openAnswerHandler(quest)">
            <h3>{{ quest.text }}</h3>
            <h4>{{ formatDate(quest.createdAt) }}</h4>
            <h4 v-if="quest.type == Question_Type.MULTIPLE_CHOICE">
              Multiple Choice
            </h4>
            <h4 v-if="quest.type == Question_Type.TRUE_FALSE">True Or False</h4>
            <h4 v-if="quest.type == Question_Type.SHORT_ANSWER">Open Ended</h4>
            <div class="icon-wrapper dropdown">
              <Icon
                name="material-symbols:delete-outline-rounded"
                class="icon"
                data-testid="delete-question-button"
                @click="modal.show = ModalType.DELETE_QUESTION" />
            </div>
          </div>
          <div
            v-if="activeQuestion.id == quest.id && openPanel == true"
            class="quiz-content">
            <!-- Quiz content panel for editing question and answers -->
            <div class="qa">
              <!-- Edit question text -->
              <div class="input-wrapper question">
                <input
                  data-testid="question-input"
                  v-model="activeQuestion.text"
                  type="text"
                  placeholder="Enter Your quesion here" />
              </div>
              <!-- Multiple choice answers -->
              <div
                v-if="activeQuestion.type == Question_Type.MULTIPLE_CHOICE"
                class="answer-list">
                <!-- List of answers for multiple choice -->
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
                      <!-- <span v-html="ans.text"></span> -->
                  </div>
                  <input
                    v-model="ans.isCorrect"
                    class="checkbox"
                    type="checkbox" />

                  <Icon
                    :class="{ disabled: answerList.length == 2 }"
                    name="material-symbols:delete-outline-rounded"
                    class="icon"
                    @click="handleDeleteAnswer(ans.id, n)" />
                </div>
              </div>
              <!-- True/False answer selection -->
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
              <!-- Short answer input -->
              <div
                v-if="activeQuestion.type == Question_Type.SHORT_ANSWER"
                class="oe">
                <div class="answer-wrapper">
                  <!-- Textarea for open-ended answer -->
                  <textarea
                    v-model="activeQuestion.shortAnswer"
                    placeholder="Your answer goes here" />
                </div>
              </div>
              <!-- Action buttons for adding answers and saving -->
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
                  :loading="loadingAnswers"
                  text="Save"
                  :icon="
                    loadingAnswers
                      ? 'line-md:uploading'
                      : 'line-md:uploading-loop'
                  "
                  @click="save()" />
              </div>
            </div>
            <!-- Panel for selecting question type and showing errors -->
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
        <!-- Empty state for new users -->
        <p class="bg">
          Looks like you're just getting started! No questions here yet.
          <br />
          Click
          <strong>"Create New Question"</strong> to make your first one. 🚀
        </p>
      </Fscreen>
      <Loading v-show="loadingQuizzes" />
      <!-- Loading spinner for quizzes -->
    </div>
    <ClientOnly>
      <!-- Modals for creating and deleting questions -->
      <Teleport to="body">
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
            <Btn data-testid="submit-question-button" @click="createQuestion()"
              >Submit Question</Btn
            >
          </div>
        </ModalComponent>
        <prompt
          msg="Are you sure you want to delete this question?"
          action-text="Delete Question"
          cancel-text="Nevermind"
          icon="material-symbols:delete-outline-rounded"
          :condition="ModalType.DELETE_QUESTION"
          @confirm="deleteQuestionHandler" />
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup>
// Dashboard logic for managing quizzes and questions
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
} = storeToRefs(dashboard); // Reactive references to dashboard state
const { setActiveQuestion, setMCQAnswers } = dashboard; // Methods for question management
const { setTokensFromOAuth } = useSession(); // Session management
import { Question_Type } from "#gql/default";
import ModalComponent from "~/components/modal-component.vue";
import QuestionType from "~/components/question-type.vue";
import { formatDate } from "~/utils/formatdate";
definePageMeta({
  middleware: "auth", // Protects page with auth middleware
  layout: "dashboard", // Uses dashboard layout
});

const modal = useModal(); // Modal state
const Question = useQuestion(); // Question API

const loading = ref(false); // Loading state for question creation
const openPanel = ref(true); // Controls open/close of question panel
// Handles opening/closing answer panel for a question
const openAnswerHandler = (question) => {
  if (activeQuestion.value.id === question.id)
    openPanel.value = !openPanel.value;
  else {
    setActiveQuestion(question);
    openPanel.value = true;
  }
};

// Delete the currently active question
const deleteQuestionHandler = async () => {
  if (!activeQuestion.value.id) return;
  await Question.del(activeQuestion.value.id);
  const index = questionList.value.findIndex(
    (q) => q.id === activeQuestion.value.id
  );
  if (index > -1) questionList.value.splice(index, 1);
  if (questionList.value.length) setActiveQuestion(questionList.value[0]);
  else setActiveQuestion(null);
  modal.close();
};
const questionModalInput = ref(null); // Ref for modal input focus

// Form state for creating a new question
const questionForm = ref({
  type: Question_Type.MULTIPLE_CHOICE,
  text: "",
  quizId: activeQuiz.value ? activeQuiz.value.id : null,
});

// Opens modal to create a new question
const postQuestionHandler = async () => {
  questionForm.value.text =
    "Question #" +
    (questionList.value.length !== 0 ? questionList.value.length + 1 : 1);
  questionForm.value.quizId = activeQuiz.value ? activeQuiz.value.id : null;
  modal.show = ModalType.POST_QUESTION;
  await nextTick();
  questionModalInput.value.focus();
};

// Creates a new question and adds it to the list
const createQuestion = async () => {
  if (!questionForm.value.text) {
    return;
  }
  loading.value = true;
  const createdQuestion = await Question.post(questionForm.value);
  questionList.value.push(createdQuestion);
  if (!questionForm.value.quizId)
    quizList.value.push({ title: "Quiz #1", id: 123 });
  loading.value = false;
  modal.close();
  if (createdQuestion.type === Question_Type.MULTIPLE_CHOICE)
    setMCQAnswers(createdQuestion.id);
  openAnswerHandler(createdQuestion);
};
const maxAnswers = 6; // Maximum allowed answers for MCQ
// Adds a new answer to the current question
const addAnswer = async () => {
  if (answerList.value.length >= maxAnswers) return;
  answerList.value.push({
    text: `Answer ${answerList.value.length + 1}`,
    isCorrect: false,
  });
  await nextTick();
  const answerInputs = document.querySelectorAll(
    ".answer-list .answer-wrapper .answer input"
  );
  if (answerInputs.length) answerInputs[answerInputs.length - 1].focus();
};
const Answer = useAnswer(); // Answer API
// Handles deletion of an answer, ensuring minimum answers remain
const handleDeleteAnswer = (id, index) => {
  if (answerList.value.length <= 2) return;
  // const confirmDelete = Answer.del(id);
  answerList.value.splice(index, 1);
};
// Saves the current question and its answers
const save = async () => {
  loadingAnswers.value = true;
  await Question.save(activeQuestion.value, answerList.value);
  loadingAnswers.value = false;
};
</script>

<style lang="scss" scoped>
// Styles for question/answer panel
.qa {
  input {
    margin-bottom: 0;
  }
}
</style>
