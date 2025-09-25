import { describe, it, expect, vi, beforeEach } from "vitest";

declare global {
  interface GlobalThis {
    GqlGetQuestion: any;
    GqlGetQuestions: any;
    GqlCreateQuestion: any;
    GqlDeleteQuestion: any;
    GqlUpdateQuestion: any;
    GqlUpdateQuestionWithAnswers: any;
    GqlCreateQuiz: any;
  }
}

beforeEach(() => {
  globalThis.GqlGetQuestion = vi.fn(async ({ id }) => ({
    GetQuestion: { id, text: "Q", points: 1 },
  }));
  globalThis.GqlGetQuestions = vi.fn(async ({ where }) => ({
    GetQuestions: [
      { id: "1", text: "Q1" },
      { id: "2", text: "Q2" },
    ],
  }));
  globalThis.GqlCreateQuestion = vi.fn(async ({ data }) => ({
    CreateQuestion: { ...data, id: "new-id" },
  }));
  globalThis.GqlDeleteQuestion = vi.fn(async ({ id }) => ({
    DeleteQuestion: { id },
  }));
  globalThis.GqlUpdateQuestion = vi.fn(async ({ id, data }) => ({
    UpdateQuestion: { ...data, id },
  }));
  globalThis.GqlUpdateQuestionWithAnswers = vi.fn(
    async ({ questionId, question, answers }) => ({
      UpdateQuestionWithAnswers: { questionId, question, answers },
    })
  );
  globalThis.GqlCreateQuiz = vi.fn(async ({ data }) => ({
    CreateQuiz: { ...data, id: "new-id" },
  }));
});

describe("useQuestion", () => {
  it("gets a single question", async () => {
    const { useQuestion } = await import("../useQuestion");
    const q = useQuestion();
    const result = await q.get("123");
    expect(result).toEqual({ id: "123", text: "Q", points: 1 });
  });

  it("gets all questions for a quiz", async () => {
    const { useQuestion } = await import("../useQuestion");
    const q = useQuestion();
    const result = await q.getAll("quiz1");
    expect(result.length).toBe(2);
    expect(result[0].text).toBe("Q1");
  });

  it("returns empty array if quiz_id is missing", async () => {
    const { useQuestion } = await import("../useQuestion");
    const q = useQuestion();
    const result = await q.getAll("");
    expect(result).toEqual([]);
  });

  it("creates a question", async () => {
    const { useQuestion } = await import("../useQuestion");
    const q = useQuestion();
    const data = { text: "New", points: 2 };
    const result = await q.post(data);
    expect(result).toMatchObject({ text: "New", points: 2, id: "new-id" });
  });

  it("deletes a question", async () => {
    const { useQuestion } = await import("../useQuestion");
    const q = useQuestion();
    const result = await q.del("del-id");
    expect(result).toEqual({ id: "del-id" });
  });

  it("updates a question", async () => {
    const { useQuestion } = await import("../useQuestion");
    const q = useQuestion();
    const data = { text: "Updated", points: 3 };
    const result = await q.edit("edit-id", data);
    expect(result).toMatchObject({ text: "Updated", points: 3, id: "edit-id" });
  });

  it("save updates question and answers", async () => {
    const { useQuestion } = await import("../useQuestion");
    const q = useQuestion();
    const question = { id: "qid", quizId: "quizid", text: "Q", points: 5 };
    const answers = [
      { id: "a1", text: "A1" },
      { id: "a2", text: "A2" },
    ];
    const result = await q.save(question, answers);
    expect(result).toMatchObject({
      questionId: "qid",
      question: expect.any(Object),
      answers,
    });
  });
});
