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
exports.ExpendituresController = void 0;
const common_1 = require("@nestjs/common");
const expenditures_service_1 = require("./expenditures.service");
const create_expenditure_dto_1 = require("./dto/create-expenditure.dto");
const update_expenditure_dto_1 = require("./dto/update-expenditure.dto");
let ExpendituresController = class ExpendituresController {
    constructor(expendituresService) {
        this.expendituresService = expendituresService;
    }
    findAll() {
        return this.expendituresService.findAll();
    }
    findOne(id) {
        return this.expendituresService.findOne(id);
    }
    create(dto) {
        return this.expendituresService.create(dto);
    }
    update(id, dto) {
        return this.expendituresService.update(id, dto);
    }
    remove(id) {
        return this.expendituresService.remove(id);
    }
};
exports.ExpendituresController = ExpendituresController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpendituresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExpendituresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expenditure_dto_1.CreateExpenditureDto]),
    __metadata("design:returntype", void 0)
], ExpendituresController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_expenditure_dto_1.UpdateExpenditureDto]),
    __metadata("design:returntype", void 0)
], ExpendituresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExpendituresController.prototype, "remove", null);
exports.ExpendituresController = ExpendituresController = __decorate([
    (0, common_1.Controller)('expenditures'),
    __metadata("design:paramtypes", [expenditures_service_1.ExpendituresService])
], ExpendituresController);
