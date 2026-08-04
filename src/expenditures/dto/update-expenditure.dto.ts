import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateExpenditureDto {
	@IsOptional()
	@IsDateString()
	date?: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	totalEscort?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	coverVan?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	receivedAmount?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	expenditure?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	surplusDue?: number;

	@IsOptional()
	@IsString()
	remarks?: string;

	@IsOptional()
	@IsString()
	sourceFile?: string;
}
