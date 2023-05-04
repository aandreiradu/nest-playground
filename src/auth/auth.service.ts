import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    const { email, password } = dto;

    try {
      const hasedPw = await argon.hash(password);

      const user = await this.prisma.user.create({
        data: {
          email: email,
          password: hasedPw,
        },
      });

      delete user['password'];
      return user;
    } catch (error) {
      console.log('error', error);

      if (error instanceof PrismaClientKnownRequestError) {
        console.log('error code este', error.code);
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async signIn(dto: AuthDto) {
    console.log('dto service', dto);
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const comparedPws = await argon.verify(user.password, dto.password);

      if (!comparedPws) {
        throw new ForbiddenException('Incorect credentials');
      }

      delete user['password'];
      return await this.signToken(user.id, user.email);
    } catch (error) {
      console.log('error', error);

      throw error;
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
