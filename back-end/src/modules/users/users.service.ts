import type { UsersRepository } from "./users.repository";
import type { CreateUserInput } from "./users.schema";

export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async upsert(input: { id: string; name: string; email: string; avatar?: string | null }) {
    return this.repository.upsert(input);
  }

  async create(input: CreateUserInput) {
    return this.repository.create(input);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async getProfile(userId: string) {
    const user = await this.repository.findById(userId);
    if (!user) return null;
    const medals = await this.repository.getMedals(userId);
    return { ...user, medals };
  }
}
