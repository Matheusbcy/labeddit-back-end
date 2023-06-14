import { ZodError } from "zod";
import { GetProductsSchema } from "../../../src/dtos/posts/getPosts.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostsBusiness } from "./../../../src/business/postsBusiness";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Testando getPosts", () => {
  const postsBusiness = new PostsBusiness(
    new TokenManagerMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock()
  );

  it("11. Token como string vazia", async () => {
    expect.assertions(1);
    try {
      const input = GetProductsSchema.parse({
        id: "id-mock-prod1",
        token: "",
      });
      await postsBusiness.getPosts(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
      }
    }
  });

  it("12. Token não sendo string", async () => {
    expect.assertions(1);
    try {
      const input = GetProductsSchema.parse({
        id: "id-mock-prod1",
        token: true,
      });
      await postsBusiness.getPosts(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "Expected string, received boolean"
        );
      }
    }
  });

  it("13. Deve buscar post", async () => {
    const input = GetProductsSchema.parse({
      id: "id-mock-prod1",
      token: "token-mock-fulano",
    });
    const output = await postsBusiness.getPosts(input);
    expect(output).toEqual([
      {
        comments: [{ comments: "", name: "" }],
        content: "bla bla bla",
        createdAt: expect.any(String),
        creator: {
          creatorId: "id-mock-fulano",
          name: "id-mock-fulano",
        },
        deslikes: 0,
        id: "id-mock-prod1",
        likes: 0,
        updatedAt: expect.any(String),
      },
    ]);
  });

  it("14. Retornar todos posts caso não seja passado id", async () => {
    const input = GetProductsSchema.parse({
      id: "",
      token: "token-mock-fulano",
    });
    const output = await postsBusiness.getPosts(input);
    expect(output).toEqual([
      {
        comments: [{ comments: "", name: "" }],
        content: "bla bla bla",
        createdAt: expect.any(String),
        creator: {
          creatorId: "id-mock-fulano",
          name: "id-mock-fulano",
        },
        deslikes: 0,
        id: "id-mock-prod1",
        likes: 0,
        updatedAt: expect.any(String),
      },
      {
        comments: [{ comments: "", name: "" }],
        content: "ble ble ble",
        createdAt: expect.any(String),
        creator: {
          creatorId: "id-mock-astrodev",
          name: "id-mock-astrodev",
        },
        deslikes: 0,
        id: "id-mock-prod2",
        likes: 0,
        updatedAt: expect.any(String),
      },
    ]);
  });

  it("Token is invalid", async () => {
    expect.assertions(2);
    try {
      const input = GetProductsSchema.parse({
        id: "id-mock-prod1",
        token: "token-mock-robertin",
      });
      await postsBusiness.getPosts(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Token is invalid");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
