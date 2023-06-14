import { ZodError } from "zod";
import { PostsBusiness } from "../../../src/business/postsBusiness";
import { EditPostSchema } from "../../../src/dtos/posts/editPosts.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Testando editPost", () => {
  const postsBusiness = new PostsBusiness(
    new TokenManagerMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock()
  );

  it("20. Post não existe", async () => {
    expect.assertions(2);
    try {
      const input = EditPostSchema.parse({
        id: "id-mock-prod10",
        content: "test-content",
        token: "token-mock-fulano",
      });
      await postsBusiness.editPost(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Posts não existe");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("21. Somente quem criou o post pode edita-lo", async () => {
    expect.assertions(2);
    try {
      const input = EditPostSchema.parse({
        id: "id-mock-prod2",
        content: "test-content",
        token: "token-mock-fulano",
      });
      await postsBusiness.editPost(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Esse usuario não pode editar esse post");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("22. Deve editar a publicação", async () => {
    const input = EditPostSchema.parse({
      id: "id-mock-prod1",
      content: "test-content",
      token: "token-mock-fulano",
    });
    const output = await postsBusiness.editPost(input);

    expect(output).toEqual({
      content: "test-content",
    });
  });

  it("23. Error - id deve ser uma string", async () => {
    expect.assertions(1);
    try {
      const input = EditPostSchema.parse({
        id: 123,
        content: "test-content",
        token: "token-mock-fulano",
      });
      await postsBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("id deve ser ums string");
      }
    }
  });

  it("24. Error - content deve ser uma string", async () => {
    expect.assertions(1);
    try {
      const input = EditPostSchema.parse({
        id: "id-mock-prod1",
        content: true,
        token: "token-mock-fulano",
      });
      await postsBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("content deve ser uma string");
      }
    }
  });

  it("25. Error - token deve ser uma string", async () => {
    expect.assertions(1);
    try {
      const input = EditPostSchema.parse({
        id: "id-mock-prod1",
        content: "test-content",
        token: false,
      });
      await postsBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("token deve ser uma string");
      }
    }
  });

  it("Token is invalid", async () => {
    expect.assertions(2);
    try {
      const input = EditPostSchema.parse({
        id: "id-mock-prod2",
        content: "content-test",
        token: "token-mock-fulan",
      });
      await postsBusiness.editPost(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Token is invalid");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
