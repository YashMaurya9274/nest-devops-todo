import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // HTTP headers in Express/NestJS are typically lowercase
    // Check for the header in a case-insensitive way
    const headerName = 'todoapikey';
    let apiKey: string | undefined;

    // Try direct access (lowercase is standard in Express)
    apiKey = request.headers[headerName] as string;

    // If not found, search case-insensitively
    if (!apiKey) {
      const headerKey = Object.keys(request.headers).find(
        (key) => key.toLowerCase() === headerName.toLowerCase(),
      );
      if (headerKey) {
        apiKey = request.headers[headerKey] as string;
      }
    }

    const expected = process.env.API_KEY;
    if (!expected) throw new UnauthorizedException('Server API key not set');
    if (!apiKey || apiKey !== expected) {
      throw new UnauthorizedException('Invalid TodoAPIKey header');
    }
    return true;
  }
}
