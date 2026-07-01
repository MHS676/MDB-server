import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveRecordDto } from './dto/save-record.dto';

@Injectable()
export class FinancialRecordsService {
  constructor(private prisma: PrismaService) {}

  private monthToNumber(month: string) {
    return Number(month);
  }

  private isOnOrBeforePeriod(recordYear: string, recordMonth: string, year: string, month: string) {
    const recordYearNumber = Number(recordYear);
    const selectedYearNumber = Number(year);
    const recordMonthNumber = this.monthToNumber(recordMonth);
    const selectedMonthNumber = this.monthToNumber(month);

    return recordYearNumber < selectedYearNumber || (
      recordYearNumber === selectedYearNumber && recordMonthNumber <= selectedMonthNumber
    );
  }

  private sumRecordValues(records: Array<Record<string, any>>, keys: string[]) {
    return records.reduce((total, record) => {
      const rowTotal = keys.reduce((rowSum, key) => rowSum + Number(record[key] || 0), 0);
      return total + rowTotal;
    }, 0);
  }

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

  async getExecutiveReport(userId: number, month: string, year: string) {
    const allRecords = await this.prisma.financialRecord.findMany({
      where: { userId },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });

    const selectedRecord = await this.prisma.financialRecord.findFirst({
      where: { userId, month, year },
    });

    const periodRecords = allRecords.filter((record) =>
      this.isOnOrBeforePeriod(record.year, record.month, year, month),
    );

    const recurringMonthlyRevenueBilled = Number(selectedRecord?.revenueBilledRecurringMonthly || 0);
    const outstandingRevenueBilled =
      Number(selectedRecord?.revenueBilledOutstandingCash || 0) +
      Number(selectedRecord?.revenueBilledOutstandingBank || 0);
    const outstandingRevenueTillEnd =
      Number(selectedRecord?.revenueTillEndOutstandingCash || 0) +
      Number(selectedRecord?.revenueTillEndOutstandingBank || 0);
    const totalReceivables = outstandingRevenueBilled + outstandingRevenueTillEnd;

    const receivableReceivedTillDate = this.sumRecordValues(periodRecords, [
      'revenueBilledReceivedCash',
      'revenueBilledReceivedBank',
      'revenueTillEndReceivedCash',
      'revenueTillEndReceivedBank',
    ]);

    const totalLifetimeInvoiced = totalReceivables + receivableReceivedTillDate;
    const receivableOutstandingTillDate = totalLifetimeInvoiced - receivableReceivedTillDate;

    return {
      period: { month, year },
      metrics: {
        recurringMonthlyRevenueBilled,
        outstandingRevenueBilled,
        totalReceivables,
        receivableReceivedTillDate,
        receivableOutstandingTillDate,
      },
      raw: {
        totalLifetimeInvoiced,
        totalLifetimeReceived: receivableReceivedTillDate,
        recordCount: periodRecords.length,
      },
      selectedRecord,
    };
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