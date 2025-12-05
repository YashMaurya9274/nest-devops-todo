import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './todo.schema';
import { Model, Types } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async create(dto: CreateTodoDto, userId: string) {
    return this.todoModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
  }

  async findAll(userId: string) {
    return this.todoModel.find({ userId: new Types.ObjectId(userId) });
  }

  async findOne(id: string, userId: string) {
    const todo = await this.todoModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, dto: UpdateTodoDto, userId: string) {
    const todo = await this.todoModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      dto,
      { new: true },
    );
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async delete(id: string, userId: string) {
    const result = await this.todoModel.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!result) throw new NotFoundException('Todo not found');
    return result;
  }
}
