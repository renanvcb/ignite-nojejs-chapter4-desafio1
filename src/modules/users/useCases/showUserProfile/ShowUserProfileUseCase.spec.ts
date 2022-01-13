import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show user profile use case", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  const testUSerData: ICreateUserDTO = {
    name: "John Doe",
    email: "john.doe@mail.com",
    password: "password",
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show the user profile", async () => {
    const user = await createUserUseCase.execute(testUSerData);

    const response = await showUserProfileUseCase.execute(user.id ?? "");

    expect(response).toHaveProperty("id");
    expect(response.name).toMatch(user.name);
    expect(response.password).not.toMatch(testUSerData.password);
  });

  it("should not be able to show the profile of a non existent user", async () => {
    expect(async () => await showUserProfileUseCase.execute("someId"))
    .rejects.toBeInstanceOf(AppError);
  });
});