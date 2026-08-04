import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateExpenditureDto {
  @IsDateString()
  date!: string;

  @IsInt()
  @Min(0)
  totalEscort!: number;

  @IsInt()
  @Min(0)
  coverVan!: number;

  @IsInt()
  @Min(0)
  receivedAmount!: number;

  @IsInt()
  @Min(0)
  expenditure!: number;

  @IsInt()
  @Min(0)
  surplusDue!: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  sourceFile?: string;
}
