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
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { RecurringService } from './recurring.service';

@UseGuards(JwtAuthGuard)
@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post()
  create(@Body() createRecurringDto: CreateRecurringDto) {
    return this.recurringService.create(createRecurringDto);
  }

  @Get()
  findAll(@Query('status') status?: 'active' | 'inactive') {
    return this.recurringService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recurringService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecurringDto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(id, updateRecurringDto);
  }

  @Patch(':id')
  toggle(@Param('id') id: string) {
    return this.recurringService.toggle(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recurringService.remove(id);
  }
}
