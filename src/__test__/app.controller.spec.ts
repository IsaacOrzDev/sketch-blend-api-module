import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('App Controller', () => {
    it('should return true for health check', () => {
      expect(appController.healthCheck()).toBe(true);
    });
  });
});
