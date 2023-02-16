import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
require('dotenv').config();

const options: DataSourceOptions & SeederOptions = {
  type: (process.env.TYPEORM_CONNECTION || 'mysql') as any,
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT) || 3306,
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || '123456a@A',
  database: process.env.TYPEORM_DATABASE || 'x_wallet',
  entities: [
    'src/database/entities/*.entity.ts'
  ],
  migrations: [
    'dist/database/migrations/*.js',
  ],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
}

const datasource = new DataSource(options);
datasource.initialize();

export default datasource; 