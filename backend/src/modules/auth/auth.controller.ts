import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

type SignupBody = {
  fullName?: string;
  email?: string;
  password?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupBody) {
    const fullName = (body.fullName || '').trim();
    const email = (body.email || '').trim();
    const password = body.password || '';

    if (!fullName || !email || !password) {
      throw new BadRequestException('fullName, email and password are required.');
    }
    return this.authService.signup(fullName, email, password);
  }

  @Post('login')
  login(@Body() body: LoginBody) {
    const email = (body.email || '').trim();
    const password = body.password || '';
    if (!email || !password) {
      throw new BadRequestException('email and password are required.');
    }
    return this.authService.login(email, password);
  }
}
