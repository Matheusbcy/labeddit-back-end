import { PostsBusiness } from "../../../src/business/postsBusiness";
import { EditLikeSchema } from "../../../src/dtos/posts/editLike.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Testando editLike", () => {
  const postsBusiness = new PostsBusiness(
    new TokenManagerMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock()
  );

  it("Token é invalido", async () => {
    expect.assertions(2);
    try {
      const input = EditLikeSchema.parse({
        id: "id-mock-prod2",
        like: true,
        token: "token-mock-fulan",
      });
      await postsBusiness.likeDislike(input);
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
      const input = EditLikeSchema.parse({
        id: "id-mock-prod25",
        like: true,
        token: "token-mock-fulano",
      });
      await postsBusiness.likeDislike(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Post not exists.");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("Você não pode curtir o proprio post", async () => {
    expect.assertions(2);
    try {
      const input = EditLikeSchema.parse({
        id: "id-mock-prod1",
        like: true,
        token: "token-mock-fulano",
      });
      await postsBusiness.likeDislike(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Você não pode curtir o proprio post");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("Deve computador o like", async () => {
    const input = EditLikeSchema.parse({
      id: "id-mock-prod2",
      like: true,
      token: "token-mock-fulano",
    });
    const output = await postsBusiness.likeDislike(input);
    expect(output).toEqual({
      message: "Seu like foi computado com sucesso",
    });
  });

  it("Deve computador o dislike", async () => {
    const input = EditLikeSchema.parse({
      id: "id-mock-prod2",
      like: false,
      token: "token-mock-fulano",
    });
    const output = await postsBusiness.likeDislike(input);
    expect(output).toEqual({
      message: "Seu dislike foi computado com sucesso",
    });
  });
  
});
