import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../types/authenticated-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get(@Request() req: AuthenticatedRequest) {
    return this.settingsService.get(req.user.userId);
  }

  @Put()
  update(
    @Request() req: AuthenticatedRequest,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.update(req.user.userId, updateSettingsDto);
  }

  @Patch()
  patch(
    @Request() req: AuthenticatedRequest,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.patch(req.user.userId, updateSettingsDto);
  }
}
