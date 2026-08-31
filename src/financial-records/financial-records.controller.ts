import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FinancialRecordsService } from './financial-records.service';
import { SaveRecordDto } from './dto/save-record.dto';

@Controller('financial-records')
export class FinancialRecordsController {
  constructor(private readonly recordsService: FinancialRecordsService) {}

  @Post('save')
  async saveRecord(@Body() dto: SaveRecordDto) {
    // Note: Authentication handled by MDB-Auth-Server. 
    // Extract userId from request context if needed via middleware.
    return this.recordsService.upsertRecord(1, dto);
  }

  @Get('period')
  async getPeriod(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    // Note: Authentication handled by MDB-Auth-Server.
    return this.recordsService.getPeriodData(1, month, year);
  }

  @Get('summary')
  async getSummary() {
    // Note: Authentication handled by MDB-Auth-Server.
    return this.recordsService.getAllRecords(1);
  }

  @Get('executive-report')
  async getExecutiveReport(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    // Note: Authentication handled by MDB-Auth-Server.
    return this.recordsService.getExecutiveReport(1, month, year);
  }

  @Get('check-data')
  async checkDataForAllMonths() {
    // Note: Authentication handled by MDB-Auth-Server.
    return this.recordsService.checkDataForAllMonths(1);
  }
}