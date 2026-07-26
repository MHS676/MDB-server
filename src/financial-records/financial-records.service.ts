import { BadRequestException, Injectable } from '@nestjs/common';
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

  private latestRecordWithValue(records: Array<Record<string, any>>, keys: string[]) {
    return [...records].reverse().find((record) =>
      keys.some((key) => Number(record[key] || 0) !== 0),
    );
  }

  private dailyEntries(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.map((entry: any) => ({
      date: entry?.date,
      cash: Number(entry?.cash || 0),
      bank: Number(entry?.bank || 0),
    }));
  }

  private validateDailyEntries(value: unknown, month: string, year: string) {
    if (!Array.isArray(value)) {
      throw new BadRequestException('Daily receivable entries must be an array.');
    }

    const periodPrefix = `${year}-${String(Number(month)).padStart(2, '0')}-`;
    const enteredDates = new Set<string>();
    return value.map((entry: any, index) => {
      const date = String(entry?.date || '');
      const cash = Number(entry?.cash || 0);
      const bank = Number(entry?.bank || 0);
      const parsedDate = new Date(`${date}T00:00:00.000Z`);
      const isValidDate = !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !date.startsWith(periodPrefix) || !isValidDate) {
        throw new BadRequestException(`Daily entry ${index + 1} must be within the selected month.`);
      }
      if (enteredDates.has(date)) {
        throw new BadRequestException(`Only one daily entry is allowed for ${date}.`);
      }
      enteredDates.add(date);
      if (!Number.isFinite(cash) || !Number.isFinite(bank) || cash < 0 || bank < 0) {
        throw new BadRequestException(`Daily entry ${index + 1} must contain valid cash and bank amounts.`);
      }
      return { date, cash, bank };
    });
  }

  async upsertRecord(userId: number, dto: SaveRecordDto) {
    const { month, year, ...metrics } = dto;

    if (metrics.revenueTillEndDailyBreakdown !== undefined) {
      const dailyEntries = this.validateDailyEntries(metrics.revenueTillEndDailyBreakdown, month, year);
      metrics.revenueTillEndDailyBreakdown = dailyEntries;
      // Keep the existing summary columns in sync for consumers that use them.
      metrics.revenueTillEndReceivedCash = dailyEntries.reduce((sum, entry) => sum + entry.cash, 0);
      metrics.revenueTillEndReceivedBank = dailyEntries.reduce((sum, entry) => sum + entry.bank, 0);
    }

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

    // A July report can use June's recurring bill and May's carried balance,
    // as in the agreed receivable calculation. Find the latest recurring bill
    // available by the report date, then the latest outstanding bill before it.
    const recurringRecord = this.latestRecordWithValue(periodRecords, [
      'revenueBilledRecurringMonthly',
    ]);
    const recurringRecordIndex = recurringRecord
      ? periodRecords.findIndex((record) => record.id === recurringRecord.id)
      : periodRecords.length;
    const outstandingRecord = this.latestRecordWithValue(
      periodRecords.slice(0, recurringRecordIndex),
      ['revenueBilledOutstandingCash', 'revenueBilledOutstandingBank'],
    );
    const receivedRecord = this.latestRecordWithValue(periodRecords, [
      'revenueTillEndReceivedCash', 'revenueTillEndReceivedBank',
    ]);

    const dailyRecords = periodRecords.filter((record) => Array.isArray(record.revenueTillEndDailyBreakdown));
    const firstDailyRecordIndex = periodRecords.findIndex((record) => Array.isArray(record.revenueTillEndDailyBreakdown));
    // Records created before daily entry support store a cumulative amount. Use
    // the last such amount as the opening balance, then add new daily entries.
    const legacyReceivedRecord = firstDailyRecordIndex === -1
      ? receivedRecord
      : this.latestRecordWithValue(periodRecords.slice(0, firstDailyRecordIndex), [
        'revenueTillEndReceivedCash', 'revenueTillEndReceivedBank',
      ]);
    const dailyReceivedCash = dailyRecords.reduce(
      (total, record) => total + this.dailyEntries(record.revenueTillEndDailyBreakdown)
        .reduce((sum, entry) => sum + entry.cash, 0),
      0,
    );
    const dailyReceivedBank = dailyRecords.reduce(
      (total, record) => total + this.dailyEntries(record.revenueTillEndDailyBreakdown)
        .reduce((sum, entry) => sum + entry.bank, 0),
      0,
    );

    const recurringMonthlyRevenueBilled = Number(recurringRecord?.revenueBilledRecurringMonthly || 0);
    const outstandingRevenueBilled =
      Number(outstandingRecord?.revenueBilledOutstandingCash || 0) +
      Number(outstandingRecord?.revenueBilledOutstandingBank || 0);

    // This is an absolute "till date" figure, not a monthly payment. Using
    // only its latest value prevents cumulative figures from being added twice.
    const receivableReceivedCashTillDate = Number(legacyReceivedRecord?.revenueTillEndReceivedCash || 0) + dailyReceivedCash;
    const receivableReceivedBankTillDate = Number(legacyReceivedRecord?.revenueTillEndReceivedBank || 0) + dailyReceivedBank;
    const receivableReceivedTillDate = receivableReceivedCashTillDate + receivableReceivedBankTillDate;

    // Accounts receivable is the amount billed in the reporting cycle plus
    // the carried outstanding billed amount. The outstanding balance must be
    // derived from that total, rather than from manually entered daily values.
    const totalReceivables = recurringMonthlyRevenueBilled + outstandingRevenueBilled;
    const receivableOutstandingTillDate = totalReceivables - receivableReceivedTillDate;

    return {
      period: { month, year },
      metrics: {
        recurringMonthlyRevenueBilled,
        outstandingRevenueBilled,
        totalReceivables,
        receivableReceivedTillDate,
        receivableReceivedCashTillDate,
        receivableReceivedBankTillDate,
        receivableOutstandingTillDate,
      },
      raw: {
        totalLifetimeInvoiced: totalReceivables,
        totalLifetimeReceived: receivableReceivedTillDate,
        recordCount: periodRecords.length,
        sources: {
          recurringMonthlyRevenueBilled: recurringRecord
            ? { month: recurringRecord.month, year: recurringRecord.year }
            : null,
          outstandingRevenueBilled: outstandingRecord
            ? { month: outstandingRecord.month, year: outstandingRecord.year }
            : null,
          receivableReceivedTillDate: legacyReceivedRecord
            ? { month: legacyReceivedRecord.month, year: legacyReceivedRecord.year }
            : null,
        },
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
