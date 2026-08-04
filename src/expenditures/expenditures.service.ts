import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenditureDto } from './dto/create-expenditure.dto';
import { UpdateExpenditureDto } from './dto/update-expenditure.dto';

@Injectable()
export class ExpendituresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.expenditure.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.expenditure.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Expenditure with id ${id} not found`);
    }
    return record;
  }

  async create(dto: CreateExpenditureDto) {
    return this.prisma.expenditure.create({
      data: {
        date: new Date(dto.date),
        totalEscort: dto.totalEscort ?? 0,
        coverVan: dto.coverVan ?? 0,
        receivedAmount: dto.receivedAmount ?? 0,
        expenditure: dto.expenditure ?? 0,
        surplusDue: dto.surplusDue ?? 0,
        remarks: dto.remarks ?? null,
        sourceFile: dto.sourceFile ?? null,
      },
    });
  }

  async update(id: number, dto: UpdateExpenditureDto) {
    const existing = await this.prisma.expenditure.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Expenditure with id ${id} not found`);
    }

    return this.prisma.expenditure.update({
      where: { id },
      data: {
        ...(dto.date ? { date: new Date(dto.date) } : {}),
        ...(dto.totalEscort !== undefined ? { totalEscort: dto.totalEscort } : {}),
        ...(dto.coverVan !== undefined ? { coverVan: dto.coverVan } : {}),
        ...(dto.receivedAmount !== undefined ? { receivedAmount: dto.receivedAmount } : {}),
        ...(dto.expenditure !== undefined ? { expenditure: dto.expenditure } : {}),
        ...(dto.surplusDue !== undefined ? { surplusDue: dto.surplusDue } : {}),
        ...(dto.remarks !== undefined ? { remarks: dto.remarks } : {}),
        ...(dto.sourceFile !== undefined ? { sourceFile: dto.sourceFile } : {}),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.expenditure.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Expenditure with id ${id} not found`);
    }

    return this.prisma.expenditure.delete({ where: { id } });
  }
}
