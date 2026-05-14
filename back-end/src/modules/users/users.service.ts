import type { UsersRepository } from "./users.repository";
import type { CreateUserInput } from "./users.schema";

export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(input: CreateUserInput) {
    return this.repository.create(input);
  }

  async findAll() {
    return this.repository.findAll();
  }
}
