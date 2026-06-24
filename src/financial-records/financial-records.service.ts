import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveRecordDto } from './dto/save-record.dto';

@Injectable()
export class FinancialRecordsService {
  constructor(private prisma: PrismaService) {}

  async upsertRecord(userId: number, dto: SaveRecordDto) {
    const { month, year, ...metrics } = dto;

    const existing = await this.prisma.financialRecord.findFirst({
      where: { userId, month, year },
    });

    if (existing) {
      return this.prisma.financialRecord.update({
        where: { id: existing.id },
        data: metrics,
      });
    }

    return this.prisma.financialRecord.create({
      data: { userId, month, year, ...metrics },
    });
  }

  async getPeriodData(userId: number, month: string, year: string) {
    return this.prisma.financialRecord.findFirst({
      where: { userId, month, year },
    });
  }

  async getAllRecords(userId: number) {
    return this.prisma.financialRecord.findMany({
      where: { userId },
      orderBy: { year: 'desc' },
    });
  }

  async checkDataForAllMonths(userId: number) {
    const allRecords = await this.prisma.financialRecord.findMany({
      where: { userId },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const summary: any = {
      totalRecords: allRecords.length,
      byYear: {} as Record<string, any[]>,
      recordsWithData: [] as Array<{ month: string; year: string }>,
      emptyRecords: [] as Array<{ month: string; year: string }>,
    };

    allRecords.forEach((record) => {
      if (!summary.byYear[record.year]) {
        summary.byYear[record.year] = [];
      }
      summary.byYear[record.year].push({
        month: monthNames[parseInt(record.month) - 1] || `Month ${record.month}`,
        monthNumber: record.month,
        year: record.year,
        hasRevenue: !!(record.revenueBilledRecurringMonthly || record.revenueBilledReceivedCash || record.revenueBilledReceivedBank),
        hasExpenditure: !!(record.expenditureBudgetedCash || record.expenditureActualCash),
        hasVAT: !!(record.vatAccruedCash || record.vatPaidCash),
        hasTDS: !!(record.tdsIncomeCash || record.tdsExpenditureCash),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });

      const hasData = !!(
        record.revenueBilledRecurringMonthly || record.revenueBilledReceivedCash ||
        record.expenditureBudgetedCash || record.vatAccruedCash || record.tdsIncomeCash
      );

      if (hasData) {
        summary.recordsWithData.push({
          month: monthNames[parseInt(record.month) - 1],
          year: record.year,
        });
      } else {
        summary.emptyRecords.push({
          month: monthNames[parseInt(record.month) - 1],
          year: record.year,
        });
      }
    });

    return summary;
  }
}