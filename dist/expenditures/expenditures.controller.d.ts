import { ExpendituresService } from './expenditures.service';
import { CreateExpenditureDto } from './dto/create-expenditure.dto';
import { UpdateExpenditureDto } from './dto/update-expenditure.dto';
export declare class ExpendituresController {
    private readonly expendituresService;
    constructor(expendituresService: ExpendituresService);
    findAll(): Promise<{
        expenditure: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        totalEscort: number;
        coverVan: number;
        receivedAmount: number;
        surplusDue: number;
        remarks: string | null;
        sourceFile: string | null;
    }[]>;
    findOne(id: number): Promise<{
        expenditure: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        totalEscort: number;
        coverVan: number;
        receivedAmount: number;
        surplusDue: number;
        remarks: string | null;
        sourceFile: string | null;
    }>;
    create(dto: CreateExpenditureDto): Promise<{
        expenditure: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        totalEscort: number;
        coverVan: number;
        receivedAmount: number;
        surplusDue: number;
        remarks: string | null;
        sourceFile: string | null;
    }>;
    update(id: number, dto: UpdateExpenditureDto): Promise<{
        expenditure: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        totalEscort: number;
        coverVan: number;
        receivedAmount: number;
        surplusDue: number;
        remarks: string | null;
        sourceFile: string | null;
    }>;
    remove(id: number): Promise<{
        expenditure: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        totalEscort: number;
        coverVan: number;
        receivedAmount: number;
        surplusDue: number;
        remarks: string | null;
        sourceFile: string | null;
    }>;
}
