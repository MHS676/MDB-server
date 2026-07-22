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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialRecordsController = void 0;
const common_1 = require("@nestjs/common");
const financial_records_service_1 = require("./financial-records.service");
const save_record_dto_1 = require("./dto/save-record.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
let FinancialRecordsController = class FinancialRecordsController {
    constructor(recordsService) {
        this.recordsService = recordsService;
    }
    async saveRecord(userId, dto) {
        return this.recordsService.upsertRecord(userId, dto);
    }
    async getPeriod(userId, month, year) {
        return this.recordsService.getPeriodData(userId, month, year);
    }
    async getSummary(userId) {
        return this.recordsService.getAllRecords(userId);
    }
    async getExecutiveReport(userId, month, year) {
        return this.recordsService.getExecutiveReport(userId, month, year);
    }
    async checkDataForAllMonths(userId) {
        return this.recordsService.checkDataForAllMonths(userId);
    }
};
exports.FinancialRecordsController = FinancialRecordsController;
__decorate([
    (0, common_1.Post)('save'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, save_record_dto_1.SaveRecordDto]),
    __metadata("design:returntype", Promise)
], FinancialRecordsController.prototype, "saveRecord", null);
__decorate([
    (0, common_1.Get)('period'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], FinancialRecordsController.prototype, "getPeriod", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinancialRecordsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('executive-report'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], FinancialRecordsController.prototype, "getExecutiveReport", null);
__decorate([
    (0, common_1.Get)('check-data'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinancialRecordsController.prototype, "checkDataForAllMonths", null);
exports.FinancialRecordsController = FinancialRecordsController = __decorate([
    (0, common_1.Controller)('financial-records'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Fully protected route group
    ,
    __metadata("design:paramtypes", [financial_records_service_1.FinancialRecordsService])
], FinancialRecordsController);
