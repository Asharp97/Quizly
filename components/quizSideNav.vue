<template>
  <div class="side-nav">
    <aside class="nav-wrapper">
      <div class="quiz-title">
        <h3>Quizzes</h3>
        <div class="icon-wrapper">
          <Icon
            class="icon"
            name="material-symbols:add-2-rounded"
            @click="postQuizHandler()" />
        </div>
      </div>
      <div class="hr" />
      <div v-if="!loadingQuizzes && quizList?.length == 0">
        <p>no Quizzes yet</p>
      </div>
      <ul v-else class="list">
        <li
          v-for="(ask, n) in quizList"
          :key="ask.id"
          class="list-item"
          :class="{ active: activeQuiz?.id == ask.id }"
          @click="setActiveQuiz(ask)">
          <div class="quiz-name-title">
            <p>
              <span> 0{{ n + 1 }}.</span>
              {{ ask.title }}
            </p>
            <div v-if="isExpired(ask)" class="expired">expired</div>
            <div class="icon-wrapper dropdown">
              <Icon
                class="icon"
                name="mi:options-horizontal"
                @click="quizMenu = n" />
              <div
                v-if="quizMenu == n"
                v-on-click-outside="closeMenu"
                ref="quizMenuRef"
                class="menu-bg">
                <div class="menu">
                  <div class="item" @click="copyQuiz(ask.link)">Copy link</div>
                  <div class="item" @click="editQuizHandler(ask.id)">
                    Edit Quiz
                  </div>
                  <div class="item" @click="deleteHandler(ask.id)">
                    Delete Quiz
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
        <pre></pre>
      </ul>
    </aside>
    <Teleport to="body">
      <!-- @clear-inputs="clearForm()"> -->
      <ModalComponent
        :condition="
          modal.show == ModalType.POST_QUIZ || modal.show == ModalType.EDIT_QUIZ
        "
        class="modal">
        <pre>{{ quizForm }}</pre>
        <div class="modal-content">
          <div class="quizSettings">
            <div class="quiz-inputs">
              <input
                v-model="quizForm.title"
                ref="quizModalInput"
                type="text"
                placeholder="Quiz Title" />
              <div class="errormessage" v-if="quizOptions.titleError">
                {{ quizOptions.titleError }}
              </div>
              <textarea
                v-model="quizForm.description"
                id="description"
                name="description"
                placeholder="Description" />
            </div>
            <div class="quiz-panel">
              <checkbox
                id="result"
                v-model="quizForm.enableFeedback"
                label="Feedback" />
              <checkbox
                id="shuffle"
                label="Publish Later"
                v-model="quizOptions.publishLater" />
              <div
                v-if="quizOptions.publishLater"
                style="display: flex; align-items: center; gap: 0.5rem">
                <input
                  id="publishDate"
                  type="datetime-local"
                  placeholder="In Minutes"
                  v-model="quizForm.publishedAt" />
              </div>

              <!-- TIME -->
              <checkbox
                id="time"
                label="Time limit"
                v-model="quizOptions.timeLimited" />
              <div
                v-if="quizOptions.timeLimited"
                style="display: flex; align-items: center; gap: 0.5rem">
                <input
                  id="time"
                  type="number"
                  placeholder="In Minutes"
                  v-model="quizForm.timeLimit" />
                <label for="time">Minutes</label>
              </div>

              <!-- DEADLINE -->
              <checkbox
                id="deadline"
                label="Deadline"
                v-model="quizOptions.deadlined" />
              <input
                v-if="quizOptions.deadlined"
                v-model="quizForm.deadline"
                id="deadline"
                type="datetime-local" />
            </div>
          </div>
          <Btn @click="submitQuizHandler()">{{
            modal.show == ModalType.POST_QUIZ ? "Submit Quiz" : "Submit Edit"
          }}</Btn>
        </div>
      </ModalComponent>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
const modal = useModal();
const quizMenu = shallowRef<number | null>(null);
function closeMenu() {
  quizMenu.value = null;
}
const dashboard = useDashboardStore();
const { quizList, activeQuiz, activeQuestion, loadingQuizzes } =
  storeToRefs(dashboard);
const { setActiveQuiz, fetchQuizzes } = dashboard;
onMounted(async () => {
  await fetchQuizzes();
  if (quizList.value && quizList.value.length) setActiveQuiz(quizList.value[0]);
});
const quizForm = ref<Partial<Quiz>>({
  title: "",
  description: "",
  timeLimit: 30,
  deadline: "",
  publishedAt: "",
  enableFeedback: false,
});
const quizOptions = ref({
  timeLimited: false,
  deadlined: false,
  publishLater: false,
  titleError: "",
});
const Quiz = useQuiz();

const quizMenuRef = ref<HTMLElement | null>(null);
const quizModalInput = ref<HTMLInputElement | null>(null);

const isExpired = (quiz: Quiz) => {
  if (!quiz?.deadline) return false;
  return new Date(quiz?.deadline) < new Date();
};

const copyQuiz = async (link: string | undefined) => {
  if (!link) return;
  const baseURL = window.location.origin;
  navigator.clipboard.writeText(`${baseURL}/quiz/${link}`);
  closeMenu();
};

const updateQuizForm = () => {
  if (!activeQuiz.value) return;
  quizForm.value = {
    ...activeQuiz.value,
    enableFeedback: !!quizForm.value.enableFeedback,
    timeLimit: quizOptions.value.timeLimited
      ? quizForm.value.timeLimit
      : null,
    deadline: quizOptions.value.deadlined && quizForm.value.deadline
      ? toDatetimeLocal(quizForm.value.deadline)
      : null,
    publishedAt: quizOptions.value.publishLater
      ? toDatetimeLocal(quizForm.value.publishedAt)
      : new Date().toISOString(),
  };
};

const postQuizHandler = async () => {
  quizForm.value.title = "Quiz #" + ((quizList.value ?? []).length + 1);
  modal.show = ModalType.POST_QUIZ;
  await nextTick();
  quizModalInput.value?.focus();
};

const editQuizHandler = async (x: string) => {
  quizForm.value = await Quiz.get(x);
  quizOptions.value.timeLimited = !!quizForm.value.timeLimit;
  quizOptions.value.deadlined = !!quizForm.value.deadline;
  quizOptions.value.publishLater =
    quizForm.value.publishedAt > new Date().toISOString();

  if (quizForm.value.deadline)
    quizForm.value.deadline = toDatetimeLocal(quizForm.value.deadline);
  if (quizForm.value.publishedAt)
    quizForm.value.publishedAt = toDatetimeLocal(quizForm.value.publishedAt);

  modal.show = ModalType.EDIT_QUIZ;
  await nextTick();
  quizModalInput.value?.focus();
};

const submitQuizHandler = async () => {
  if (!quizForm.value.title) {
    quizOptions.value.titleError = "Title is required";
    return;
  } else {
    quizOptions.value.titleError = "";
  }

  if (modal.show == ModalType.POST_QUIZ) {
    const postQuizForm = {
      ...quizForm.value,
      timeLimit: quizOptions.value.timeLimited
        ? quizForm.value.timeLimit
        : null,
      deadline: quizOptions.value.deadlined
        ? new Date(quizForm.value.deadline).toISOString()
        : null,
      publishedAt: quizOptions.value.publishLater
        ? new Date(quizForm.value.publishedAt).toISOString()
        : new Date().toISOString(),
    };
    const createdQuiz = await Quiz.post(postQuizForm);
    if (createdQuiz) quizList.value?.push(createdQuiz);
    setActiveQuiz(createdQuiz);
  }
  if (modal.show == ModalType.EDIT_QUIZ && activeQuiz.value) {
    updateQuizForm();
    await Quiz.edit(activeQuiz.value.id, quizForm.value);
  }
  modal.close();
};

const deleteHandler = async (id: string) => {
  await Quiz.del(id);
  if (!quizList.value) return;
  const index = quizList.value.findIndex((q) => q.id === id);
  if (index !== -1) {
    quizList.value.splice(index, 1);
    if (activeQuiz.value?.id === id) {
      setActiveQuiz(quizList.value[0] || null);
    }
  }
  closeMenu();
};
</script>

<style lang="scss" scoped></style>
