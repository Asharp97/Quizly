import { describe, it, expect, vi, beforeEach } from "vitest";

declare global {
  interface GlobalThis {
    GqlGetQuiz: any;
    GqlGetQuizzes: any;
    GqlCreateQuiz: any;
    GqlDeleteQuiz: any;
    GqlUpdateQuiz: any;
  }
}

beforeEach(() => {
  globalThis.GqlGetQuiz = vi.fn(async (args) => {
    return {
      GetQuiz: { id: args.where?.id, title: "Quiz", description: "Desc" },
    };
  });
  globalThis.GqlGetQuizzes = vi.fn(async ({ where, orderBy }) => ({
    GetQuizzes: [
      { id: "1", title: "Q1" },
      { id: "2", title: "Q2" },
    ],
  }));
  globalThis.GqlCreateQuiz = vi.fn(async ({ data }) => ({
    CreateQuiz: { ...data, id: "new-id" },
  }));
  globalThis.GqlDeleteQuiz = vi.fn(async ({ id }) => ({ DeleteQuiz: { id } }));
  globalThis.GqlUpdateQuiz = vi.fn(async ({ id, data }) => ({
    UpdateQuiz: {
      title: { set: data.title.set },
      description: { set: data.description.set },
      id,
    },
  }));
});

describe("useQuiz", () => {
  it("gets a single quiz", async () => {
    const { useQuiz } = await import("../useQuiz");
    const quiz = useQuiz();
    const result = await quiz.get({ where: { id: "123" } });
    expect(result).toEqual({ id: "123", title: "Quiz", description: "Desc" });
  });

  // it("gets all quizzes for a user", async () => {
  //   vi.resetModules();
  //   vi.doMock("../stores/useSession", () => ({
  //     useSession: () => ({ user: { id: "user1" } }),
  //   }));
  //   const { useQuiz } = await import("../useQuiz");
  //   const quiz = useQuiz();
  //   const result = await quiz.getAll();
  //   expect(result.length).toBe(2);
  //   expect(result[0].title).toBe("Q1");
  // });

  it("throws error if no user in session", async () => {
    vi.resetModules();
    vi.doMock("../stores/useSession", () => ({
      useSession: () => ({ user: null }),
    }));
    const { useQuiz } = await import("../useQuiz");
    const quiz = useQuiz();
    await expect(quiz.getAll()).rejects.toThrow("No user in session");
  });

  it("creates a quiz", async () => {
    const { useQuiz } = await import("../useQuiz");
    const quiz = useQuiz();
    const data = { title: "New Quiz", description: "Desc" };
    const result = await quiz.post(data);
    expect(result).toMatchObject({
      title: "New Quiz",
      description: "Desc",
      id: "new-id",
    });
  });

  it("deletes a quiz", async () => {
    const { useQuiz } = await import("../useQuiz");
    const quiz = useQuiz();
    const result = await quiz.del("del-id");
    expect(result).toEqual({ id: "del-id" });
  });

  it("updates a quiz", async () => {
    const { useQuiz } = await import("../useQuiz");
    const quiz = useQuiz();
    const updateData = {
      title: "Updated",
      description: "Updated Desc",
    };
    const result = await quiz.edit("edit-id", updateData);
    expect(result).toMatchObject({
      title: { set: "Updated" },
      description: { set: "Updated Desc" },
      id: "edit-id",
    });
  });
});
