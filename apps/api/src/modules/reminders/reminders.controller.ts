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
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { RemindersService } from './reminders.service';

@UseGuards(JwtAuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createReminderDto: CreateReminderDto,
  ) {
    return this.remindersService.create(createReminderDto, req.user.userId);
  }

  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('status') status?: 'paid' | 'unpaid',
  ) {
    return this.remindersService.findAll(req.user.userId, status);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.remindersService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersService.update(id, updateReminderDto, req.user.userId);
  }

  @Patch(':id')
  async patch(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { action?: string },
  ) {
    if (body.action === 'markPaid') {
      return this.remindersService.markPaid(id, req.user.userId);
    } else if (body.action === 'markUnpaid') {
      return this.remindersService.markUnpaid(id, req.user.userId);
    }
    return this.remindersService.findOne(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.remindersService.remove(id, req.user.userId);
  }
}
