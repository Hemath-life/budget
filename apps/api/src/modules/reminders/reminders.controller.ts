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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { RemindersService } from './reminders.service';

@UseGuards(JwtAuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(createReminderDto);
  }

  @Get()
  findAll(@Query('status') status?: 'paid' | 'unpaid') {
    return this.remindersService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remindersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersService.update(id, updateReminderDto);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() body: { action?: string }) {
    if (body.action === 'markPaid') {
      return this.remindersService.markPaid(id);
    } else if (body.action === 'markUnpaid') {
      return this.remindersService.markUnpaid(id);
    }
    return this.remindersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remindersService.remove(id);
  }
}
