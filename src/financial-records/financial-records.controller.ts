import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { FinancialRecordsService } from './financial-records.service';
import { SaveRecordDto } from './dto/save-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('financial-records')
@UseGuards(JwtAuthGuard) // Fully protected route group
export class FinancialRecordsController {
  constructor(private readonly recordsService: FinancialRecordsService) {}

  @Post('save')
  async saveRecord(@GetUser('id') userId: number, @Body() dto: SaveRecordDto) {
    return this.recordsService.upsertRecord(userId, dto);
  }

  @Get('period')
  async getPeriod(
    @GetUser('id') userId: number,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.recordsService.getPeriodData(userId, month, year);
  }

  @Get('summary')
  async getSummary(@GetUser('id') userId: number) {
    return this.recordsService.getAllRecords(userId);
  }

  @Get('executive-report')
  async getExecutiveReport(
    @GetUser('id') userId: number,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.recordsService.getExecutiveReport(userId, month, year);
  }

  @Get('check-data')
  async checkDataForAllMonths(@GetUser('id') userId: number) {
    return this.recordsService.checkDataForAllMonths(userId);
  }
}