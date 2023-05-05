import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDTO } from '../src/user/dto';

describe('APP E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'andrei@test.com',
      password: '123',
    };
    describe('signUp', () => {
      it('should throw if email is emtpy', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({
            password: '123',
          })
          .expectStatus(400);
      });

      it('should throw if password is emtpy', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({
            email: 'andrei@test.com',
          })
          .expectStatus(400);
      });

      it('should throw if no req body', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({})
          .expectStatus(400);
      });

      it('should signUp', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('signIn', () => {
      it('should signIn', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });

      it('should throw if email is emtpy', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({
            password: '123',
          })
          .expectStatus(400);
      });

      it('should throw if password is emtpy', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({
            email: 'andrei@test.com',
          })
          .expectStatus(400);
      });

      it('should throw if no req body', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({})
          .expectStatus(400);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const editUserDto: EditUserDTO = {
          firstName: 'Andrei',
          email: 'andrei@qw.com',
        };

        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(editUserDto)
          .expectBodyContains(editUserDto.firstName)
          .expectBodyContains(editUserDto.email)
          .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should return empty array if no bookmarks found', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([])
          .inspect();
        //326:27
      });
    });

    describe('Create bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete bookmark', () => {});
  });
});
