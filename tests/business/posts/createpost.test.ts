import { ZodError } from "zod";
import { PostsBusiness } from "../../../src/business/postsBusiness";
import { CreateProductSchema } from "../../../src/dtos/posts/createPosts.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Testando createPost", () => {
  const postsBusiness = new PostsBusiness(
    new TokenManagerMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock()
  );

  it("15. Error - token como string vazia", async () => {
    expect.assertions(1);
    try {
      const input = CreateProductSchema.parse({
        content: "cotent-test",
        token: "",
      });
      await postsBusiness.createPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
      }
    }
  });

  it("16. Error - Token não sendo string", async () => {
    expect.assertions(1);
    try {
      const input = CreateProductSchema.parse({
        content: "cotent-test",
        token: 123,
      });
      await postsBusiness.createPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "Expected string, received number"
        );
      }
    }
  });

  it("17. Error - content deve ser string", async () => {
    expect.assertions(1);
    try {
      const input = CreateProductSchema.parse({
        content: true,
        token: "token-mock-fulano",
      });
      await postsBusiness.createPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("content deve ser string");
      }
    }
  });

  it("18. Error - content não pode ter menos de 2 char", async () => {
    expect.assertions(1);
    try {
      const input = CreateProductSchema.parse({
        content: "A",
        token: "token-mock-fulano",
      });
      await postsBusiness.createPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 2 character(s)"
        );
      }
    }
  });

  it("19. Posts ja existe", async () => {
    expect.assertions(2);
    try {
      const input = CreateProductSchema.parse({
        content: "bla bla bla",
        token: "token-mock-fulano",
      });
      await postsBusiness.createPost(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Post already exists");
        expect(error.statusCode).toBe(400);
      }
    }
  });
  it("Token is invalid", async () => {
    expect.assertions(2);
    try {
      const input = CreateProductSchema.parse({
        content: "cotent-test",
        token: "token-robetin",
      });
      await postsBusiness.createPost(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Token is invalid");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("Criar post", async () => {
    const input = CreateProductSchema.parse({
      content: "cotent-test",
      token: "token-mock-fulano",
    });
    const output = await postsBusiness.createPost(input);

    expect(output).toEqual({ content: "cotent-test" });
  });
});
