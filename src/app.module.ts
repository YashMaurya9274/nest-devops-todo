import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { TodoModule } from './todo/todo.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/todo_dev',
    ),
    UsersModule,
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
