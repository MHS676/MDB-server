import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FinancialRecordsModule } from './financial-records/financial-records.module';
import { ExpendituresModule } from './expenditures/expenditures.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    FinancialRecordsModule,
    ExpendituresModule,
  ],
  controllers: [AppController],
})
export class AppModule {}