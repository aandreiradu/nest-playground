import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signup(dto: AuthDto) {
    return this.authService.signUp();
  }

  @Post('signIn')
  login() {
    console.log('i am signed in');

    return {
      msg: this.authService.signIn(),
    };
  }
}
