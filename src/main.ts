import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for PWA frontend
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174', // Added port 5174
      'http://localhost:4173',
      'https://fieldlogger-frontend-production.up.railway.app',
      /\.railway\.app$/ // Allow all railway subdomains (regex)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log('🚀 Backend running on http://localhost:3000');
}
bootstrap();
