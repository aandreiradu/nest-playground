import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EditUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDTO) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });

      delete updatedUser['password'];

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
