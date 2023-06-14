import { ZodError } from "zod";
import { PostsBusiness } from "../../../src/business/postsBusiness";
import { DeletePostsSchema } from "../../../src/dtos/posts/deletePost.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Testando deletePost", () => {
  const postsBusiness = new PostsBusiness(
    new TokenManagerMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock()
  );

  it("Token é invalido", async () => {
    expect.assertions(2);
    try {
      const input = DeletePostsSchema.parse({
        id: "id-mock-prod1",
        token: "token-mock-fulan",
      });
      await postsBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Token is invalid");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("Post não existe", async () => {
    expect.assertions(2);
    try {
      const input = DeletePostsSchema.parse({
        id: "id-mock-prod10",
        token: "token-mock-fulano",
      });
      await postsBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Post not exists.");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("So quem criou o post pode deletar", async () => {
    expect.assertions(2);
    try {
      const input = DeletePostsSchema.parse({
        id: "id-mock-prod2",
        token: "token-mock-fulano",
      });
      const output = await postsBusiness.deletePost(input);
      console.log(output);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe(
          "usuário não tem permissão para apagar esse post."
        );
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("Deletar post", async () => {
    const input = DeletePostsSchema.parse({
      id: "id-mock-prod1",
      token: "token-mock-fulano",
    });
    const output = await postsBusiness.deletePost(input);

    expect(output).toEqual({
      message: "Post deleted",
    });
  });

  it("Error - id deve ser string", async () => {
    expect.assertions(1);
    try {
      const input = DeletePostsSchema.parse({
        id: 123,
        token: "token-mock-fulano",
      });
      await postsBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("id deve ser ums string");
      }
    }
  });

  it("Error - token deve ser uma string", async () => {
    expect.assertions(1);
    try {
      const input = DeletePostsSchema.parse({
        id: "id-mock-prod1",
        token: true,
      });
      await postsBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("token deve ser ums string");
      }
    }
  });
});
