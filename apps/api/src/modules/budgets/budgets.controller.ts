import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../types/authenticated-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return this.budgetsService.create(createBudgetDto, req.user.userId);
  }

  @Post('load-defaults')
  loadDefaults(@Request() req: AuthenticatedRequest) {
    return this.budgetsService.loadDefaults(req.user.userId);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.budgetsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.budgetsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, updateBudgetDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.budgetsService.remove(id, req.user.userId);
  }
}
