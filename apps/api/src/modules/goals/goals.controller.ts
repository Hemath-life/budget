import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';

@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(createGoalDto, req.user.userId);
  }

  @Post('load-defaults')
  loadDefaults(@Request() req) {
    return this.goalsService.loadDefaults(req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.goalsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.goalsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, updateGoalDto, req.user.userId);
  }

  @Patch(':id')
  async patch(@Request() req, @Param('id') id: string, @Body() body: any) {
    if (body.amount !== undefined && typeof body.amount === 'number') {
      return this.goalsService.contribute(id, body.amount, req.user.userId);
    }
    return this.goalsService.update(id, body, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.goalsService.remove(id, req.user.userId);
  }
}
