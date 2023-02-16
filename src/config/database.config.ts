import { ResetPassword, User } from "src/database/entities";

export const databaseConfig = {
  type: (process.env.TYPEORM_CONNECTION || 'mysql') as any,
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT) || 3306,
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || '123456a@A',
  database: process.env.TYPEORM_DATABASE || 'x_wallet',
  entities: [
    User,
    ResetPassword
  ],
  migrations: [
    'dist/database/migrations/*.js',
  ],
  synchronize: true,
};