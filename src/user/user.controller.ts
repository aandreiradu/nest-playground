import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../../src/auth/decorator';
import { JwtGuard } from '../../src/auth/guard';
import { EditUserDTO } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('id') user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDTO) {
    return this.userService.editUser(userId, dto);
  }
}
