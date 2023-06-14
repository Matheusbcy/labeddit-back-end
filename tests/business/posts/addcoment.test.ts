import { PostsBusiness } from "../../../src/business/postsBusiness";
import { PostCommentSchema } from "../../../src/dtos/posts/addComment.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Testando addComent", () => {
  const postsBusiness = new PostsBusiness(
    new TokenManagerMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock()
  );

  it("Token é invalido", async () => {
    expect.assertions(2);
    try {
      const input = PostCommentSchema.parse({
        token: "token-mock-fulan",
        postId: "id-mock-prod2",
        comment: "commen-test",
      });
      await postsBusiness.addComment(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Token is invalid");
        expect(error.statusCode).toBe(400);
      }
    }
  });
  it("Deve adicionar um comentario ao post", async () => {
    const input = PostCommentSchema.parse({
      token: "token-mock-fulano",
      postId: "id-mock-prod2",
      comment: "commen-test",
    });
    const output = await postsBusiness.addComment(input);
    expect(output).toEqual({
      message: "Comentario adicionado com sucesso!",
    });
  });
});
