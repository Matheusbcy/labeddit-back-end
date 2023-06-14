import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { ZodError } from "zod";

describe("Testando signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  it("1. Deve gerar um token ao se cadastrar.", async () => {
    const input = SignupSchema.parse({
      name: "name-test",
      email: "name-test@example.com",
      password: "password-test",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      token: "token-mock",
    });
  });

  it("2. Deve disparar um erro caso o email ja exista.", async () => {
    expect.assertions(2);
    try {
      const input = SignupSchema.parse({
        name: "name-test",
        email: "fulano@email.com",
        password: "password-test",
      });

      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("'email' já existe");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  it("3. Deve disparar erro se o name não possuir pelo menos 2 char", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "",
        email: "name-test@example.com",
        password: "password-test",
      });
      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 2 character(s)"
        );
      }
    }
  });

  it("4. Deve disparar erro se o email não possuir pelo menos 2 char", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "name-test",
        email: "",
        password: "password-test",
      });
      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("Invalid email");
      }
    }
  });

  it("5. Deve disparar erro se o password não possuir pelo menos 4 char", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "name-test",
        email: "name-test@example.com",
        password: "123",
      });
      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 4 character(s)"
        );
      }
    }
  });
});
