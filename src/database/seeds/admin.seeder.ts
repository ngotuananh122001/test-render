import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../entities';

export default class AdminSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    repository.clear();

    let hashPassword = await argon2.hash('Admin@123');
    const admins = [
      {
        email: 'supperAdmin@gmail.com',
        password: hashPassword,
        roles: ['supperadmin', 'admin'],
      }
    ]

    const newAdmins = repository.create(admins);
    await repository.save(newAdmins);

    // ---------------------------------------------------
  }
}