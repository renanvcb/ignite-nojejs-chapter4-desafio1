import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

describe("Create statement use case", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  const testUSerData: ICreateUserDTO = {
    name: "John Doe",
    email: "john.doe@mail.com",
    password: "password",
  };

  const testStatementData: ICreateStatementDTO = {
    user_id: "",
    amount: 0,
    description: "Test statement",
    type: OperationType.WITHDRAW,
  };

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute(testUSerData);

    const statement = await createStatementUseCase.execute({
      ...testStatementData,
      user_id: `${user.id}`,
    });

    expect(statement).toHaveProperty("id");
    expect(statement.user_id).toEqual(user.id);
    expect(statement.type).toEqual(OperationType.WITHDRAW);
    expect(statement.amount).toEqual(testStatementData.amount);
    expect(statement.description).toEqual(testStatementData.description);
  });

  it("should not be able to create a statement to a non existant user", () => {
    expect(async () => {
      await createStatementUseCase.execute(testStatementData);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a withdraw statement if user has insufficient funds", async () => {
    const user = await createUserUseCase.execute(testUSerData);

    expect(async () => {
      await createStatementUseCase.execute({
        ...testStatementData,
        amount: 9999,
        user_id: `${user.id}`,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
