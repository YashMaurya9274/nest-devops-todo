import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  ApiTags,
  ApiOperation,
  ApiSecurity,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiResponseHelper } from '../common/helpers/response.helper';

@ApiTags('Todo')
@ApiSecurity('TodoAPIKeyAuth')
@ApiBearerAuth()
@Controller('todo')
@UseGuards(ApiKeyGuard, JwtAuthGuard)
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Todo' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateTodoDto, @Req() req: any) {
    const todo = await this.todoService.create(dto, req.user.id);

    return ApiResponseHelper.success({
      message: 'Todo created successfully',
      data: { todo },
      statusCode: 201,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all Todos for user' })
  @ApiResponse({ status: 200 })
  async findAll(@Req() req: any) {
    const todos = await this.todoService.findAll(req.user.id);

    return ApiResponseHelper.success({
      message: 'Todos retrieved successfully',
      data: { todos },
      statusCode: 200,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single Todo' })
  @ApiResponse({ status: 200 })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const todo = await this.todoService.findOne(id, req.user.id);

    return ApiResponseHelper.success({
      message: 'Todo retrieved successfully',
      data: { todo },
      statusCode: 200,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Todo' })
  @ApiResponse({ status: 200 })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
    @Req() req: any,
  ) {
    const todo = await this.todoService.update(id, dto, req.user.id);

    return ApiResponseHelper.success({
      message: 'Todo updated successfully',
      data: { todo },
      statusCode: 200,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Todo' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.todoService.delete(id, req.user.id);

    return ApiResponseHelper.success({
      message: 'Todo deleted successfully',
      data: null,
      statusCode: 200,
    });
  }
}
