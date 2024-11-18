<template>
  <div class="dashboard">
    <div class="side-nav">
      <aside v-if="!editQuiz" class="nav-wrapper">
        <div class="back-icon-wrapper" @click="editQuiz = true">
          <Icon
            name="material-symbols:chevron-right-rounded"
            class="icon back" />
        </div>
        <div class="title">
          <h3>Workspaces</h3>
          <div class="icon-wrapper">
            <Icon class="icon" name="material-symbols:add-2-rounded" />
          </div>
        </div>
        <div class="hr" />
        <div class="list">
          <div
            v-for="workspace in workspaces"
            :key="workspace.id"
            class="list-item"
            :class="{ active: activeWorkspace == workspace.id }"
            @click="activeWorkspace = workspace.id">
            <!-- <input type="text" :value="workspace.name" disabled> -->
            {{ workspace.name }}
            <div class="icon-wrapper dropdown">
              <Icon
                class="icon"
                name="mi:options-horizontal"
                @click="workspaceMenu = workspace.id" />
              <div
                v-if="workspaceMenu == workspace.id"
                ref="workspaceMenuRef"
                class="menu-bg">
                <div class="menu">
                  <div class="item">Edit Name</div>
                  <div class="item">Delete workspace</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <aside v-else class="nav-wrapper">
        <div class="back-icon-wrapper" @click="editQuiz = false">
          <Icon
            name="material-symbols:chevron-left-rounded"
            class="icon back" />
        </div>
        <div class="title">
          <h3>Questions</h3>
          <div class="icon-wrapper">
            <Icon class="icon" name="material-symbols:add-2-rounded" />
          </div>
        </div>
        <div class="hr" />
        <ol class="list">
          <li
            v-for="question in questions"
            :key="question.id"
            class="list-item"
            :class="{ active: activequestion == question.id }"
            @click="activeQuestion = question.id">
            <!-- <input type="text" :value="workspace.name" disabled> -->
            {{ question.text }}
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
                  <div class="item">Edit Name</div>
                  <div class="item">Delete question</div>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </aside>
    </div>
    <div class="quizes-list">
      <div class="quiz-titles">
        <div />
        <div>Responses</div>
        <div>Created at</div>
      </div>
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
                <div class="item">Edit title</div>
                <div class="item">Delete quiz</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeQuiz == quiz.id" class="quiz-content">
          <div class="qa">
            <div class="input-wrapper question">
              <input type="text" placeholder="Enter Your quesion here">
            </div>
            <div class="input-wrapper answer">
              <input type="text" placeholder="And here is your answer">
            </div>
            <btn text="Submit"/>
          </div>
          <div class="panel">
              <input type="checkbox" v-model="test">
              {{ test }}
          </div>
        </div>
      </div>
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
const test= ref(false)
const supabase = useSupabaseClient();

const workspaces = ref();
const activeWorkspace = ref();
const workspaceMenu = ref(null);
const workspaceMenuRef = ref(null);
onClickOutside(workspaceMenuRef, () => (workspaceMenu.value = null));

const quizes = ref();
const activeQuiz = ref();
const quizMenu = ref(null);
const quizMenuRef = ref(null);
onClickOutside(quizMenuRef, () => (quizMenu.value = null));

const questions = ref();
const activeQuestion = ref();
const questioneMenu = ref(null);
const questioneMenuRef = ref(null);
onClickOutside(questioneMenuRef, () => (questioneMenu.value = null));

const editQuiz = ref(false);

onMounted(async () => {
  await getWorkspaces();
  // await getQuizes()
});

watch(
  () => activeWorkspace.value,
  () => getQuizes()
);

const getWorkspaces = async () => {
  const { data, error } = await supabase.from("workspaces").select();
  if (data) {
    workspaces.value = data;
    activeWorkspace.value = workspaces.value[0].id;
  } else console.log(error);
};

const getQuizes = async () => {
  const { data, error } = await supabase
    .from("quizes")
    .select()
    .eq("workspace_id", activeWorkspace.value);
  if (data) {
    quizes.value = data;
    activeQuestion.value = quizes.value[0].id;
  } else console.log(error);
};

const getQuestions = async (x) => {
  const { data, error } = await supabase
    .from("questions")
    .select()
    .eq("quiz_id", x);
  if (data) {
    questions.value = data;
    editQuiz.value = true;
  } else console.log(error);
};
</script>

<style lang="scss" scoped>
input {
  background-color: transparent;
  border: none;
  margin-bottom: 0;
}
</style>
