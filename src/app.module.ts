import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InspectionModule } from './inspection/inspection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    InspectionModule,
  ],
})
export class AppModule { }

