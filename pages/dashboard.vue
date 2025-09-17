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

      <div v-if="quizList.length && !loading" class="quetion-list">
        <div class="quiz-titles">
          <div />
          <div>Created at</div>
          <div>Question Type</div>
        </div>
        <div v-for="quest in questionList" :key="quest.id" class="quiz-data">
          <div
            class="quiz-header"
            :class="{ active: activeQuestion == quest.id }"
            @click="
              () => {
                if (activeQuestion.value.id == quest.id)
                  openPanel.value = !openPanel.value;
                else {
                  activeQuestion.value.id = quest.id;
                  openPanel.value = true;
                }
              }
            ">
            <h3>{{ quest.text }}</h3>
            <h4>{{ formatDate(quest.created_at) }}</h4>
            <h4 v-if="quest.type == Question_Type.MULTIPLE_CHOICE">
              Multiple Choice
            </h4>
            <h4 v-if="quest.type == Question_Type.TRUE_FALSE">True Or False</h4>
            <h4 v-if="quest.type == Question_Type.OPEN_ENDED">Open Ended</h4>
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
              <!-- <div v-if="activeQuestion.type == questionType.MULTIPLE_CHOICE" class="answer-list">
                <div
                  v-for="(reply, n) in answerList"
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
              <div v-if="activeQuestion.type == questionType.TRUE_FALSE" class="tf">
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
              <div v-if="activeQuestion.type == questionType.SHORT_ANSWER" class="oe">
                <div class="answer-wrapper">
                  <textarea
                    v-model="answer.oe.text"
                    placeholder="Your answer goes here" />
                </div>
              </div> -->
              <div class="button-group">
                <Btn
                  :disabled="
                    answerList.length > maxAnswers ||
                    activeQuestion.type !== questionType.MULTIPLE_CHOICE
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
      <Fscreen v-if="questionList.length === 0 && !loading">
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
      <ClientOnly>
        <ModalComponent :condition="modal.show == ModalTypes.POST_QUESTION">
          <div class="modal-content">
            <input
              ref="questionModalInput"
              v-model="activeQuestion.text"
              type="text"
              placeholder="Question" />
            <question-type
              :title="false"
              v-model:questionType="activeQuestion.type" />
            <Btn @click="">Submit Question</Btn>
          </div>
        </ModalComponent>
      </ClientOnly>
    </Teleport>
  </div>
</template>

<script setup>
import { Question_Type } from "#gql/default";
import { onClickOutside } from "@vueuse/core";
import { formatDate } from "~/utils/formatdate";
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const Quiz = useQuiz();
const Question = useQuestion();
const Answer = useAnswer();

const session = useSession();
const { isLoggedIn } = storeToRefs(session);
const modal = useModal();

// --- STATE MANAGEMENT ---
const activeQuiz = ref({ id: 0 });
const activeQuestion = ref({ id: 0 });

const { data: quizList } = await useAsyncData("getQuizzes", () =>
  Quiz.getAll()
);

const questionList = ref([]);
const answerList = ref([]);

const loadingQuestions = ref(false);
const loadingAnswers = ref(false);
watch(activeQuiz, async (newQuiz) => {
  if (!newQuiz?.id) {
    questionList.value = [];
    return;
  }
  loadingQuestions.value = true;

  const { data } = await Question.getAll(newQuiz.id);
  questionList.value = data?.GetQuestions || [];

  loadingQuestions.value = false;

  activeQuestion.value = questionList.value[0] || null;
});

watch(activeQuestion, async (newQuestion) => {
  if (!newQuestion?.id) {
    answerList.value = [];
    return;
  }
  loadingAnswers.value = true;
  const { data } = await Answer.getAll(newQuestion.id);
  answerList.value = data?.GetAnswers || [];
  loadingAnswers.value = false;
});

const loading = ref(false);
const openPanel = ref(true);

//QUESTIONS FUNCTIONS
const questionMenu = ref(null);
const questionMenuRef = ref(null);
const questionModalInput = ref(null);

const handlePostQuestion = async () => {
  // Question.name = "Question #" + (Question.list.length + 1);
  // modal.show = ModalTypes.POST_QUESTION;
  // await nextTick();
  // questionModalInput.value.focus();
};

onClickOutside(questionMenuRef, () => (questionMenu = null));
</script>

<style lang="scss" scoped>
.qa {
  input {
    margin-bottom: 0;
  }
}
</style>
