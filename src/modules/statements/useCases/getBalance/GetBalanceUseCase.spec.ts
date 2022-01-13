import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get balance use case", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let inMemoryStatetementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  const userData: ICreateUserDTO = {
    email: "user@example.com",
    name: "user",
    password: "password",
  };

  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatetementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatetementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatetementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get the user balance", async () => {
    const user = await createUserUseCase.execute(userData);

    const deposit = await createStatementUseCase.execute({
      user_id: `${user.id}`,
      amount: 100,
      description: "Deposit",
      type: OperationType.DEPOSIT,
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: `${user.id}`,
      amount: 15,
      description: "Withdrawal",
      type: OperationType.WITHDRAW,
    });

    const desiredBalance = deposit.amount - withdraw.amount;

    const balance = await getBalanceUseCase.execute({ user_id: `${user.id}` });

    expect(balance.balance).toBe(desiredBalance);
  });

  it("should not be able to get the balance of a non existant user", async () => {
    expect(
      // eslint-disable-next-line no-return-await
      async () => await getBalanceUseCase.execute({ user_id: "any id" })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
