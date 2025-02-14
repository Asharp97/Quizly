<template>
  <div class="side-nav">
    <aside class="nav-wrapper">
      <div class="quiz-title">
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
          <div class="quiz-name-title">
            <p>
              <span> 0{{ n + 1 }}.</span>
              {{ ask.text }} 
            </p>
            <div v-if="deadLine(ask.deadLine) < now" class="expired">
              expired
            </div>
            <div class="icon-wrapper dropdown">
              <Icon
                class="icon"
                name="mi:options-horizontal"
                @click="quiz.menu = ask.id" />
              <div v-if="quiz.menu == ask.id" ref="quizMenuRef" class="menu-bg">
                <div class="menu">
                  <div class="item" @click="copyQuiz(ask.id)">Copy link</div>
                  <div class="item" @click="handleQuizEditor(ask.id)">
                    Edit Quiz
                  </div>
                  <div class="item" @click="quiz.del(ask.id)">Delete Quiz</div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ol>
    </aside>
    <Teleport to="body">
      <ModalComponent
        :condition="modal.show == 'postQuiz' || modal.show == 'editQuiz'"
        class="modal"
        @clear-inputs="quiz.clearInputs()">
        <div class="modal-content">
          <div class="quizSettings">
            <div class="quiz-inputs">
              <input
                ref="quizModalInput"
                v-model="quiz.name"
                type="text"
                placeholder="Quiz Title" />
              <textarea
                id="description"
                v-model="quiz.description"
                name="description"
                placeholder="Description" />
            </div>
            <div class="quiz-panel">
              <!-- SHOW RESULTS -->
              <checkbox
                id="result"
                v-model="quiz.show_result"
                label="Feedback" />

              <!-- TIME -->
              <checkbox id="time" v-model="quiz.time" label="Time limited" />
              <input
                v-if="quiz.time"
                v-model="quiz.time"
                type="number"
                placeholder="In Minutes" />

              <!-- DEADLINE -->
              <checkbox
                id="deadline"
                v-model="localDeadline"
                label="Deadline" />
              <input
                v-if="localDeadline"
                id="deadline"
                v-model="localDeadline"
                type="datetime-local"
                @change="updateDeadLine" />
            </div>
          </div>
          <!-- SUBMIT EDIT OR POST -->
          <Btn @click="handleQuizSubmit()">{{
            modal.show == "postQuiz" ? "Post Quiz" : "Submit Edit"
          }}</Btn>
        </div>
      </ModalComponent>
    </Teleport>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";
const modal = useModal();
const loading = ref(false);
const quiz = useQuiz();
const quizMenuRef = ref(null);
const quizModalInput = ref(null);

const localDeadline = ref();
const updateDeadLine = () => {
  if (localDeadline.value) {
    quiz.deadLine = new Date(localDeadline.value).toISOString();
  }
};

watch(
  () => quiz.deadLine,
  () => {
    if (quiz.deadLine) localDeadline.value = quiz.deadLine.slice(0, 16);
    else localDeadline.value = false;
  }
);
watch(
  () => localDeadline.value,
  () => {
    if (localDeadline.value == false) quiz.deadLine = null;
  }
);

const now = new Date();
const deadLine = (x) => {
  if (x) return new Date(x);
};

onMounted(async () => {
  await getQuizes();
});

const copyQuiz = async (x) => {
  // const baseURL = "https://quizly-app.tiiny.site";
  const baseURL = "http://localhost:3000";

  await quiz.get(x);
  navigator.clipboard.writeText(`${baseURL}/quiz/${x}/${quiz.sharingKey}`);
};
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

const handleQuizSubmit = async () => {
  if (modal.show == "postQuiz") quiz.post();
  else quiz.edit();
};
onClickOutside(quizMenuRef, () => (quiz.menu = null));
</script>

<style lang="scss" scoped></style>
