import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signup(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('signIn')
  login(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
