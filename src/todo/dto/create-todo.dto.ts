import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Milk, bread, eggs', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
