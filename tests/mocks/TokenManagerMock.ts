import { USER_ROLES } from "./../../src/models/User";
import { TokenPayLoad } from "../../src/services/TokenManager";

export class TokenManagerMock {
  public createToken = (payload: TokenPayLoad): string => {
    if (payload.id === "id-mock") {
      // signup de nova conta
      return "token-mock";
    } else if (payload.id === "id-mock-fulano") {
      // login de fulano (conta normal)
      return "token-mock-fulano";
    } else {
      // login de astrodev (conta admin)
      return "token-mock-astrodev";
    }
  };

  public getPayload = (token: string): TokenPayLoad | null => {
    if (token === "token-mock-fulano") {
      return {
        id: "id-mock-fulano",
        name: "Fulano",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-astrodev") {
      return {
        id: "id-mock-astrodev",
        name: "Astrodev",
        role: USER_ROLES.ADMIN,
      };
    } else {
      return null;
    }
  };
}