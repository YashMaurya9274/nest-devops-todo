import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiResponseHelper } from '../common/helpers/response.helper';

@Controller('auth')
@ApiTags('Auth')
@ApiSecurity('TodoAPIKeyAuth')
@UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  // ----------------- REGISTER -----------------
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(
      dto.email,
      dto.password,
      dto.name,
    );
    return ApiResponseHelper.success({
      message: 'User registered successfully',
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user.id.toString(),
        },
      },
      statusCode: 201,
    });
  }

  // ----------------- LOGIN -----------------
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT cookie' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userEntity = await this.authService.validateUser(
      dto.email,
      dto.password,
    );
    if (!userEntity) throw new UnauthorizedException('Invalid credentials');

    const { access_token } = await this.authService.loginPayload({
      id: userEntity.id.toString(),
      email: userEntity.email,
      name: userEntity.name ?? '',
    });

    const cookieName = process.env.COOKIE_NAME || 'todoAuthKey';
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie(cookieName, access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge:
        Number(process.env.JWT_EXPIRES_IN_SECONDS || 3600) * 1000 ||
        1000 * 60 * 60,
    });

    return ApiResponseHelper.success({
      message: 'Login successful',
      data: {
        user: {
          email: userEntity.email,
          name: userEntity.name,
          id: userEntity.id.toString(),
        },
      },
      statusCode: 200,
    });
  }

  // ----------------- ME -----------------
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Authenticated User Details' })
  async me(@Req() req: Request) {
    const user = (req as any).user;

    return ApiResponseHelper.success({
      message: 'User details retrieved successfully',
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user.id.toString(),
        },
      },
      statusCode: 200,
    });
  }

  // ----------------- LOGOUT -----------------
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookieName = process.env.COOKIE_NAME || 'todoAuthKey';
    res.clearCookie(cookieName, { httpOnly: true });

    return ApiResponseHelper.success({
      message: 'Logout successful',
      data: null,
      statusCode: 200,
    });
  }
}
