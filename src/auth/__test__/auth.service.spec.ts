import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import AccessTokenService from '../access-token.service';
import { ProxyModule } from 'src/proxy/proxy.module';
import { UserModule } from 'src/user/user.module';
import { UserGrpc } from 'src/proxy/user.grpc';
import { of } from 'rxjs';

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        getToken: jest
          .fn()
          .mockResolvedValue({ tokens: { id_token: 'mock-token' } }),
        verifyIdToken: jest.fn().mockImplementation(() => {
          return {
            getPayload: jest.fn().mockReturnValue({
              /* mock payload */
              accessToken: 'accessToken',
            }),
          };
        }),
      };
    }),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  const emailService = { findAll: () => ['test'] };
  const accessTokenService = { generateAccessToken: () => 'token' };
  const userGrpc = {
    client: {
      findUser: () =>
        of({
          user: {
            id: 'id',
          },
        }),
      createUser: () =>
        of({
          user: {
            id: 'id',
          },
        }),
      loginUser: () =>
        of({
          user: {
            id: 'id',
          },
        }),
    },
  };

  beforeEach(async () => {
    process.env.GOOGLE_CLIENT_ID = 'mock-google-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'mock-google-client-secret';
    const app: TestingModule = await Test.createTestingModule({
      imports: [EmailModule, ProxyModule, UserModule],
      controllers: [],
      providers: [AuthService, AccessTokenService],
    })
      .overrideProvider(EmailService)
      .useValue(emailService)
      .overrideProvider(AccessTokenService)
      .useValue(accessTokenService)
      .overrideProvider(UserGrpc)
      .useValue(userGrpc)
      .overrideProvider(UserModule)
      .useValue({})
      .compile();

    service = app.get<AuthService>(AuthService);
  });

  it('should authenticate google user', async () => {
    const result = await service.authenticateGoogleUser('mock-code');
    expect(result.accessToken).not.toBeNull();
  });
});
