import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ExpendituresService } from './expenditures.service';
import { CreateExpenditureDto } from './dto/create-expenditure.dto';
import { UpdateExpenditureDto } from './dto/update-expenditure.dto';

@Controller('expenditures')
export class ExpendituresController {
  constructor(private readonly expendituresService: ExpendituresService) {}

  @Get()
  findAll() {
    return this.expendituresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expendituresService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateExpenditureDto) {
    return this.expendituresService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExpenditureDto) {
    return this.expendituresService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expendituresService.remove(id);
  }
}
