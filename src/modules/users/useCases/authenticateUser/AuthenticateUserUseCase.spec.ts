import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User Use Case", () => {
  const testUSerData: ICreateUserDTO = {
    name: "John Doe",
    email: "john.doe@mail.com",
    password: "password",
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    await createUserUseCase.execute(testUSerData);

    const { user, token } = await authenticateUserUseCase.execute({
      email: testUSerData.email,
      password: testUSerData.password,
    });

    console.log(user, token);
  });
});