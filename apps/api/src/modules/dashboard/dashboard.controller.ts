import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from '../../types/authenticated-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Request() req: AuthenticatedRequest) {
    return this.dashboardService.getDashboard(req.user.userId);
  }
}
