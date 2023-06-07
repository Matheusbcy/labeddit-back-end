import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { USER_ROLES, User, UserDB } from "../models/User";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  //ja feito
  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    const userDBExists = await this.userDatabase.findUserByEmail(email);

    if (userDBExists) {
      throw new BadRequestError("'email' já existe");
    }

    const id = this.idGenerator.generate();

    const hashPassword = await this.hashManager.hash(password);

    const newUser = new User(
      id,
      name,
      email,
      hashPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    const newUserDB = newUser.toDBModel();

    await this.userDatabase.insertUser(newUserDB);

    const token = this.tokenManager.createToken({
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    });

    const output: SignupOutputDTO = {
      token,
    };

    return output;
  };

  //ja feito
  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new NotFoundError("'email' não encontrado");
    }

    const hashedPassword = userDB.password;

    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("'email' ou 'password' incorretos");
    }

    const token = this.tokenManager.createToken({
      id: userDB.id,
      name: userDB.name,
      role: userDB.role,
    });
    const output: LoginOutputDTO = {
      token,
    };

    return output;
  };
}
