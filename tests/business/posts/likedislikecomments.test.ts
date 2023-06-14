import { PostsBusiness } from "../../../src/business/postsBusiness";
import { EditLikeCommentsSchema } from "../../../src/dtos/posts/editlikeComment.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("", () => {
  const postsBusiness = new PostsBusiness(
    new TokenManagerMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock()
  );

  it("Token é valido", async () => {
    expect.assertions(2);
    try {
      const input = EditLikeCommentsSchema.parse({
        comment: "test-comments",
        like: true,
        token: "token-mock-fulan",
      });
      await postsBusiness.likeDislikeComments(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Token is invalid");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("Comentario não existe", async () => {
    expect.assertions(2);
    try {
      const input = EditLikeCommentsSchema.parse({
        comment: "test-comments",
        like: true,
        token: "token-mock-fulano",
      });
      await postsBusiness.likeDislikeComments(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Comentario não existe");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
