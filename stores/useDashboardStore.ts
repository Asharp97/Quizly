import { Question_Type } from "#gql/default";
import { defineStore } from "pinia";

// Pinia store for managing dashboard state, quizzes, questions, and answers
export const useDashboardStore = defineStore("dashboard", () => {
  // --- COMPOSABLES ---
  const Quiz = useQuiz(); // Quiz API composable
  const Question = useQuestion(); // Question API composable
  const Answer = useAnswer(); // Answer API composable

  // --- STATE --- LISTS
  // List of all quizzes
  const quizList = ref<Quiz[] | null>([]);
  // List of all questions for the active quiz
  const questionList = ref<Question[] | null>([]);
  // List of all answers for the active question
  const answerList = ref<Partial<Answer>[] | null>([]);

  // --- ACTIVES ---
  // Currently active quiz
  const activeQuiz = ref<Quiz | null>(null);
  // Currently active question
  const activeQuestion = ref<Question | null>(null);

  // --- LOADING ---
  // Loading states for quizzes, questions, and answers
  const loadingQuizzes = ref(false);
  const loadingQuestions = ref(false);
  const loadingAnswers = ref(false);

  // --- FETCHES ---
  // Fetches all quizzes
  const fetchQuizzes = async () => {
    loadingQuizzes.value = true;
    quizList.value = await Quiz.getAll();
    loadingQuizzes.value = false;
  };

  // Fetches all questions for a given quiz
  const fetchQuestions = async (quizId: string) => {
    if (!quizId) {
      questionList.value = [];
      return;
    }
    loadingQuestions.value = true;
    questionList.value = await Question.getAll(quizId);
    loadingQuestions.value = false;
  };

  // Fetches all answers for a given question
  const fetchAnswers = async (question: Question) => {
    if (!question?.id) {
      answerList.value = [];
      return;
    }
    loadingAnswers.value = true;
    answerList.value = await Answer.getAll(question.id);
    // If no answers and question is MCQ, initialize default answers
    if (
      answerList.value.length === 0 &&
      question.type === Question_Type.MULTIPLE_CHOICE
    )
      setMCQAnswers(question.id);
    loadingAnswers.value = false;
  };

  // Initializes default answers for a multiple choice question
  const setMCQAnswers = (questionId: string) => {
    answerList.value = [
      ...Array.from({ length: 3 }, (_, i) => ({
        text: `Answer ${i + 1}`,
        questionId: questionId,
        isCorrect: i === 0 ? true : false,
      })),
    ];
  };

  // --- SETTERS ---
  // Sets the active quiz and loads its questions
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

  // Sets the active question and loads its answers
  const setActiveQuestion = async (question: Question) => {
    if (!question?.id) {
      answerList.value = [];
      return;
    }
    activeQuestion.value = question;

    loadingAnswers.value = true;
    await fetchAnswers(question);
    loadingAnswers.value = false;
  };

  // Moves to the next question in the list
  const next = async () => {
    if (!activeQuestion.value || !questionList.value) return;

    const currentIndex = questionList.value.findIndex(
      (q) => q.id === activeQuestion.value?.id
    );
    if (currentIndex === questionList.value.length - 1) return;
    const nextQuestion = questionList.value[currentIndex + 1] || null;
    await setActiveQuestion(nextQuestion);
    return nextQuestion;
  };

  // --- RETURN ---
  // Expose dashboard state and methods
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
    setMCQAnswers,

    next,
  };
});
