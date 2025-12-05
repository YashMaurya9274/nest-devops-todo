import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'StrongPassword123!' })
  password: string;
}
