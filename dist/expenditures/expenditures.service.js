"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpendituresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpendituresService = class ExpendituresService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // A record date is a calendar/business date, not a time. Store it at UTC
    // midday so it cannot cross into an adjacent date when rendered worldwide.
    toBusinessDate(value) {
        const dateOnly = value.slice(0, 10);
        return new Date(`${dateOnly}T12:00:00.000Z`);
    }
    async findAll() {
        return this.prisma.expenditure.findMany({
            orderBy: { date: 'desc' },
        });
    }
    async findOne(id) {
        const record = await this.prisma.expenditure.findUnique({ where: { id } });
        if (!record) {
            throw new common_1.NotFoundException(`Expenditure with id ${id} not found`);
        }
        return record;
    }
    async create(dto) {
        return this.prisma.expenditure.create({
            data: {
                date: this.toBusinessDate(dto.date),
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
    async update(id, dto) {
        const existing = await this.prisma.expenditure.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Expenditure with id ${id} not found`);
        }
        return this.prisma.expenditure.update({
            where: { id },
            data: {
                ...(dto.date ? { date: this.toBusinessDate(dto.date) } : {}),
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
    async remove(id) {
        const existing = await this.prisma.expenditure.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Expenditure with id ${id} not found`);
        }
        return this.prisma.expenditure.delete({ where: { id } });
    }
};
exports.ExpendituresService = ExpendituresService;
exports.ExpendituresService = ExpendituresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpendituresService);
