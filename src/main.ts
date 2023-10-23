import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { SentryFilter } from './sentry-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!!process.env.SENTRY_DNS) {
    Sentry.init({
      dsn: process.env.SENTRY_DNS,
      integrations: [new ProfilingIntegration()],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    });

    const httpAdapter = app.getHttpAdapter();
    app.useGlobalFilters(new SentryFilter(httpAdapter));
  }

  const config = new DocumentBuilder()
    .setTitle('Sketch Blend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : [process.env.PORTAL_URL, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
