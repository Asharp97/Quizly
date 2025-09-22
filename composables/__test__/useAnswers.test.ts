import { describe, it, expect, vi } from "vitest";
import { useAnswer } from "../useAnswers";

declare global {
  interface GlobalThis {
    GqlGetAnswer: any;
    GqlGetAnswers: any;
    GqlCreateAnswer: any;
    GqlDeleteAnswer: any;
    GqlUpdateAnswer: any;
  }
}

describe("useAnswer", () => {
  const mockGetAnswer = vi.fn(async ({ id }) => ({
    GetAnswer: { id, text: "Sample answer", isCorrect: true },
  }));
  const mockGetAnswers = vi.fn(async ({ where }) => ({
    GetAnswers: [
      { id: "1", text: "A", isCorrect: true },
      { id: "2", text: "B", isCorrect: false },
    ],
  }));
  const mockCreateAnswer = vi.fn(async ({ data }) => ({
    CreateAnswer: { ...data, id: "new-id" },
  }));
  const mockDeleteAnswer = vi.fn(async ({ id }) => ({ DeleteAnswer: { id } }));
  const mockUpdateAnswer = vi.fn(async ({ id, data }) => ({
    UpdateAnswer: { ...data, id },
  }));

  // Mock global GQL functions
  globalThis.GqlGetAnswer = mockGetAnswer;
  globalThis.GqlGetAnswers = mockGetAnswers;
  globalThis.GqlCreateAnswer = mockCreateAnswer;
  globalThis.GqlDeleteAnswer = mockDeleteAnswer;
  globalThis.GqlUpdateAnswer = mockUpdateAnswer;

  const answer = useAnswer();

  it("gets a single answer", async () => {
    const result = await answer.get("123");
    expect(result).toEqual({
      id: "123",
      text: "Sample answer",
      isCorrect: true,
    });
  });

  it("gets all answers for a question", async () => {
    const result = await answer.getAll("q1");
    expect(result.length).toBe(2);
    expect(result[0].text).toBe("A");
  });

  it("returns empty array if question_id is missing", async () => {
    const result = await answer.getAll("");
    expect(result).toEqual([]);
  });

  it("creates an answer", async () => {
    const data = { text: "New", isCorrect: false };
    const result = await answer.post(data);
    expect(result).toMatchObject({
      text: "New",
      isCorrect: false,
      id: "new-id",
    });
  });

  it("deletes an answer", async () => {
    const result = await answer.del("del-id");
    expect(result).toEqual({ id: "del-id" });
  });

  it("updates an answer", async () => {
    const data = { text: { set: "Updated" }, isCorrect: { set: true } };
    const result = await answer.edit("edit-id", data);
    expect(result).toMatchObject({
      text: { set: "Updated" },
      isCorrect: { set: true },
      id: "edit-id",
    });
  });
});
