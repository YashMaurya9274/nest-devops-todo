import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  @ApiPropertyOptional({ example: 'Updated title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
