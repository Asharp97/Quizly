<template>
  <div class="dashboard">
    <div class="side-nav">
      <aside v-if="!quizEditor" class="nav-wrapper">
        <div class="back-icon-wrapper" @click="quizEditor = true">
          <Icon
            name="material-symbols:chevron-right-rounded"
            class="icon back" />
        </div>
        <div class="title">
          <h3>Workspaces</h3>
          <div class="icon-wrapper" @click="handlPostWorkspace()">
            <Icon class="icon" name="material-symbols:add-2-rounded" />
          </div>
        </div>
        <div class="hr" />
        <ol class="list">
          <li
            v-for="(workspace, n) in workspaces"
            :key="workspace.id"
            class="list-item"
            :class="{ active: activeWorkspace == workspace.id }"
            @click="activeWorkspace = workspace.id">
            <!-- <input type="text" :value="workspace.name" disabled> -->
            <p>
              <span> 0{{ n + 1 }}.</span>
              {{ workspace.name }}
            </p>
            <div class="icon-wrapper dropdown">
              <Icon
                class="icon"
                name="mi:options-horizontal"
                @click="workspaceMenu = workspace.id" />
              <Transition name="scale-up">
                <div
                  v-if="workspaceMenu == workspace.id"
                  ref="workspaceMenuRef"
                  class="menu-bg">
                  <div class="menu">
                    <div
                      class="item"
                      @click="handleEditWorkspace(workspace.id)">
                      Edit Name
                    </div>
                    <div class="item" @click="deleteWorkspace(workspace.id)">
                      Delete workspace
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </li>
        </ol>
      </aside>
      <aside v-if="quizEditor" class="nav-wrapper">
        <div class="back-icon-wrapper" @click="quizEditor = false">
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
            v-for="(question, n) in questions"
            :key="question.id"
            class="list-item"
            :class="{ active: activeQuestion == question.id }"
            @click="activeQuestion = question.id">
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
            <div v-for="n in answerCount" :key="n" class="input-wrapper answer">
              <input
                v-model="answer[n - 1].text"
                type="text"
                placeholder="And here is your answer" />
            </div>
            <btn text="Submit" @click="submitQA()" />
          </div>
          <div class="panel">
            <button class="addAnswer" @click="addAnswer()">Add Answer</button>
            <select
              id=""
              v-model="questionType"
              name=""
              :class="!questionType ? 'placeholder' : ''">
              <option value="" disabled>Question Type</option>
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
          <div>
            <input
              v-show="
                modal.show == 'postWorkspace' || modal.show == 'editWorkspace'
              "
              ref="workspaceModalInput"
              v-model="workspaceName"
              type="text"
              placeholder="Workspace Title" />
            <Btn v-if="modal.show == 'postWorkspace'" @click="postWorkspace"
              >New Workspace</Btn
            >
            <Btn v-if="modal.show == 'editWorkspace'" @click="editWorkspace"
              >Submit Edit</Btn
            >
          </div>
          <div>
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
          </div>
        </ModalComponent>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";
import { formatDate } from "~/utils/formatdate";
const modal = useModal();
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
const supabase = useSupabaseClient();
const session = useSession();

const loading = ref(false);
const noContent = ref(false);

const clearInputs = () => {
  workspaceName.value = "";
  quizName.value = "";
};

//WORKSPACE FUNCTIONS
const workspaces = ref([]);
const activeWorkspace = ref();
const workspaceMenu = ref(null);
const workspaceMenuRef = ref(null);
const workspaceModalInput = ref(null);

const workspaceName = ref();
const getWorkspaces = async () => {
  const { data, error } = await supabase.from("workspaces").select();
  if (data) {
    workspaces.value = data;
  } else console.log(error);
};
const getWorkspace = async (x) => {
  const { data, error } = await supabase
    .from("workspaces")
    .select()
    .eq("id", x);
  if (data) workspaceName.value = data[0].name;
  else console.log(error);
};
const handlPostWorkspace = async () => {
  workspaceName.value = "Workspace #" + (workspaces.value.length + 1);
  modal.show = "postWorkspace";
  await nextTick();
  workspaceModalInput.value.focus();
};
const postWorkspace = async () => {
  const { error } = await supabase
    .from("workspaces")
    .insert({ name: workspaceName.value, user_id: session.user.id });
  if (error) console.log(error);
  else {
    getWorkspaces();
    modal.close();
    workspaceName.value = "";
  }
};
const deleteWorkspace = async (x) => {
  const response = await supabase.from("workspaces").delete().eq("id", x);
  if (response.status == 204) {
    getWorkspaces();
    modal.close();
  }
};
const handleEditWorkspace = async (x) => {
  await getWorkspace(x);
  modal.show = "editWorkspace";
  await nextTick();
  workspaceModalInput.value.focus();
};
const editWorkspace = async () => {
  const { error } = await supabase
    .from("workspaces")
    .update({ name: workspaceName.value })
    .eq("id", activeWorkspace.value);
  if (error) console.log(error);
  else {
    getWorkspaces();
    modal.close();
    workspaceName.value = "";
  }
};
onClickOutside(workspaceMenuRef, () => {
  workspaceMenu.value = null;
});

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
    const { data, error } = await supabase
      .from("quizes")
      .select()
      .eq("workspace_id", activeWorkspace.value);
    if (data) {
      quizes.value = data;
      activeQuestion.value = quizes.value[0].id;
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
  quizName.value = "Quiz # " + (quizes.value.length + 1);
  modal.show = "postQuiz";
  await nextTick();
  quizModalInput.value.focus();
};
const postQuiz = async () => {
  const { error } = await supabase
    .from("quizes")
    .insert({ title: quizName.value, workspace_id: activeWorkspace.value });
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
const questioneMenu = ref(null);
const questioneMenuRef = ref(null);

const questionName = ref();
const questionType = ref("");

onClickOutside(questioneMenuRef, () => (questioneMenu.value = null));

const getQuestions = async (x) => {
  const { data, error } = await supabase
    .from("questions")
    .select()
    .eq("quiz_id", x);
  if (data) {
    questions.value = data;
    quizEditor.value = true;
  } else console.log(error);
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
  if (data) {
    quizName.value = "";
    activeQuestion.value = data[0].id;
  }
};

const answerCount = ref(1);
const answer = ref([
  {
    text: "welcome to chilis",
    is_correct: false,
  },
]);
const addAnswer = () => {
  answer.value.push({ text: "", is_correct: false });
  answerCount.value++;
};

const postAnswer = async () => {
  const { error } = await supabase.from("answers").insert({
    question_id: activeQuestion.value,
    text: answer.value.text,
    is_correct: answer.value.is_correct,
  });
  if (error) console.log(error);
  else {
    answer.value.text = "";
  }
};


const submitQA = async () => {
  await postQuestion();
  await postAnswer(activeQuestion.value);
  await getQuestions(activeQuiz.value);
};

const quizEditor = ref(false);

onMounted(async () => {
  await getWorkspaces();
  activeWorkspace.value = workspaces.value[0].id;
});

watch(
  () => activeWorkspace.value,
  () => getQuizes()
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
