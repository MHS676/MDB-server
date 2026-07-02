import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveRecordDto {
@IsNotEmpty()
  month!: string;

  @IsNotEmpty()
  year!: string;

  @IsOptional() 
  @IsNumber() 
  revenueBilledRecurringMonthly?: number;

  @IsOptional() @IsNumber() revenueBilledReceivedCash?: number;
  @IsOptional() @IsNumber() revenueBilledReceivedBank?: number;
  @IsOptional() @IsNumber() revenueBilledOutstandingCash?: number;
  @IsOptional() @IsNumber() revenueBilledOutstandingBank?: number;

  @IsOptional() @IsNumber() revenueTillEndReceivedCash?: number;
  @IsOptional() @IsNumber() revenueTillEndReceivedBank?: number;
  @IsOptional() @IsNumber() revenueTillEndOutstandingCash?: number;
  @IsOptional() @IsNumber() revenueTillEndOutstandingBank?: number;
  @IsOptional() revenueTillEndDailyBreakdown?: Record<string, any>[] | Record<string, any>;

  @IsOptional() @IsNumber() expenditureBudgetedCash?: number;
  @IsOptional() @IsNumber() expenditureBudgetedBank?: number;
  @IsOptional() @IsNumber() expenditureActualCash?: number;
  @IsOptional() @IsNumber() expenditureActualBank?: number;

  @IsOptional() @IsNumber() vatAccruedCash?: number;
  @IsOptional() @IsNumber() vatAccruedBank?: number;
  @IsOptional() @IsNumber() vatPaidCash?: number;
  @IsOptional() @IsNumber() vatPaidBank?: number;

  @IsOptional() @IsNumber() tdsIncomeCash?: number;
  @IsOptional() @IsNumber() tdsIncomeBank?: number;
  @IsOptional() @IsNumber() tdsExpenditureCash?: number;
  @IsOptional() @IsNumber() tdsExpenditureBank?: number;
}