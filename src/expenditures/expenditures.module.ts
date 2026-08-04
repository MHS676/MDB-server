import { Module } from '@nestjs/common';
import { ExpendituresController } from './expenditures.controller';
import { ExpendituresService } from './expenditures.service';

@Module({
  controllers: [ExpendituresController],
  providers: [ExpendituresService],
})
export class ExpendituresModule {}
