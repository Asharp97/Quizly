import { defineStore } from "pinia";
export const useDashboardStore = defineStore("dashboard", () => {
  // COMPOSABLES
  const Quiz = useQuiz();
  const Question = useQuestion();
  const Answer = useAnswer();
  // --- STATE --- LISTS
  const quizList = ref<Quiz[] | null>([]);
  const questionList = ref<Question[] | null>([]);
  const answerList = ref<Answer[] | null>([]);

  //ACTIVES
  const activeQuiz = ref<Quiz | null>(null);
  const activeQuestion = ref<Question | null>(null);

  // LOADING
  const loadingQuizzes = ref(false);
  const loadingQuestions = ref(false);
  const loadingAnswers = ref(false);

  // FETCHES
  const fetchQuizzes = async () => {
    loadingQuizzes.value = true;
    quizList.value = await Quiz.getAll();
    loadingQuizzes.value = false;
  };
  const fetchQuestions = async (quizId: string) => {
    if (!quizId) {
      questionList.value = [];
      return;
    }
    loadingQuestions.value = true;
    questionList.value = await Question.getAll(quizId);
    loadingQuestions.value = false;
  };
  const fetchAnswers = async (questionId: string) => {
    if (!questionId) {
      answerList.value = [];
      return;
    }
    loadingAnswers.value = true;
    answerList.value = await Answer.getAll(questionId);
    loadingAnswers.value = false;
  };

  // SETTERS
  const setActiveQuiz = async (quiz: Quiz) => {
    if (!quiz.id) {
      questionList.value = [];
      activeQuestion.value = null;
      answerList.value = [];
      return;
    }
    activeQuiz.value = quiz;


    loadingQuestions.value = true;
    questionList.value = await Question.getAll(quiz.id);
    loadingQuestions.value = false;

    const firstQuestion = questionList.value[0] || null;
    await setActiveQuestion(firstQuestion);
  };
  const setActiveQuestion = async (question: Question) => {
    if (!question?.id) {
      answerList.value = [];
      return;
    }
    activeQuestion.value = question;

    loadingAnswers.value = true;
    answerList.value = await Answer.getAll(question.id);
    loadingAnswers.value = false;
  };

  // --- RETURN ---
  return {
    quizList,
    questionList,
    answerList,

    activeQuiz,
    activeQuestion,

    loadingQuizzes,
    loadingQuestions,
    loadingAnswers,

    fetchQuizzes,
    setActiveQuiz,

    fetchQuestions,
    setActiveQuestion,

    fetchAnswers,
  };
});
