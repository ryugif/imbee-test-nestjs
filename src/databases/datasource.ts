import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { FCM_Job } from './fcm_job.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql', // or 'mysql', 'sqlite', etc.
  host: 'localhost',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [FCM_Job],
  migrations: ['migrations/*.ts'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
