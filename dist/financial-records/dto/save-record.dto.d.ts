export declare class SaveRecordDto {
    month: string;
    year: string;
    revenueBilledRecurringMonthly?: number;
    revenueBilledReceivedCash?: number;
    revenueBilledReceivedBank?: number;
    revenueBilledOutstandingCash?: number;
    revenueBilledOutstandingBank?: number;
    revenueTillEndReceivedCash?: number;
    revenueTillEndReceivedBank?: number;
    revenueTillEndOutstandingCash?: number;
    revenueTillEndOutstandingBank?: number;
    revenueTillEndDailyBreakdown?: Record<string, any>[] | Record<string, any>;
    expenditureBudgetedCash?: number;
    expenditureBudgetedBank?: number;
    expenditureActualCash?: number;
    expenditureActualBank?: number;
    vatAccruedCash?: number;
    vatAccruedBank?: number;
    vatPaidCash?: number;
    vatPaidBank?: number;
    tdsIncomeCash?: number;
    tdsIncomeBank?: number;
    tdsExpenditureCash?: number;
    tdsExpenditureBank?: number;
}
