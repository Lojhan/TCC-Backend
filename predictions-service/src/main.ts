import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { RetriesGuard } from './guards/retries.guard';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new RetriesGuard());
  await app.listen(3000);
}
bootstrap();
