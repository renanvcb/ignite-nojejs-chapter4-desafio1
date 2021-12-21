import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should create a new user", async () => {
    const response = await createUserUseCase.execute({
      name: "John Doe",
      email: "john.doe@mail.com",
      password: "password",
    })
  });

  expect(response.status).toBe(201);
});