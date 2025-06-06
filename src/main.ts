import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initializeTransactionalContext()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
