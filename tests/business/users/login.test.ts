import { ZodError } from "zod";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { LoginSchema } from "../../../src/dtos/user/login.dto";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  it("6. login deve gerar um token", async () => {
    const input = LoginSchema.parse({
      email: "fulano@email.com",
      password: "fulano123",
    });
    const output = await userBusiness.login(input);

    expect(output).toEqual({
      token: "token-mock-fulano",
    });
  });

  it("7. Erro - email não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = LoginSchema.parse({
        email: "fulano-test@email.com",
        password: "fulano123",
      });
      await userBusiness.login(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("'email' não encontrado");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  it("8. Erro - email ou password estão incorretos", async () => {
    expect.assertions(2);
    try {
      const input = LoginSchema.parse({
        email: "fulano@email.com",
        password: "fulano1235",
      });
      await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("'email' ou 'password' incorretos");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("9. Erro - email não é uma string", async () => {
    expect.assertions(1);
    try {
      const input = LoginSchema.parse({
        email: true,
        password: "fulano1235",
      });
      await userBusiness.login(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "Expected string, received boolean"
        );
      }
    }
  });

  it("10. Erro - password deve conter pelo menos 4 caracteres", async () => {
    expect.assertions(1);
    try {
      const input = LoginSchema.parse({
        email: "fulano@email.com",
        password: "ful",
      });
      await userBusiness.login(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 4 character(s)"
        );
      }
    }
  });
});
