import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../types/authenticated-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { RecurringService } from './recurring.service';

@UseGuards(JwtAuthGuard)
@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createRecurringDto: CreateRecurringDto,
  ) {
    return this.recurringService.create(createRecurringDto, req.user.userId);
  }

  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('status') status?: 'active' | 'inactive',
  ) {
    return this.recurringService.findAll(req.user.userId, status);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.recurringService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateRecurringDto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(
      id,
      updateRecurringDto,
      req.user.userId,
    );
  }

  @Patch(':id')
  toggle(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.recurringService.toggle(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.recurringService.remove(id, req.user.userId);
  }
}
