import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const settings = await this.prisma.settings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      // Create default settings if not exists
      const defaultSettings = await this.prisma.settings.create({
        data: {
          id: 1,
          defaultCurrency: 'INR',
          theme: 'system',
          dateFormat: 'MMM dd, yyyy',
          language: 'en',
          notificationsEnabled: true,
        },
      });
      return this.mapToResponse(defaultSettings);
    }

    return this.mapToResponse(settings);
  }

  async update(updateSettingsDto: UpdateSettingsDto) {
    // Ensure settings exist first
    await this.get();

    const settings = await this.prisma.settings.update({
      where: { id: 1 },
      data: updateSettingsDto,
    });

    return this.mapToResponse(settings);
  }

  async patch(updateSettingsDto: UpdateSettingsDto) {
    // Ensure settings exist first
    await this.get();

    const data: any = {};

    if (updateSettingsDto.defaultCurrency !== undefined) {
      data.defaultCurrency = updateSettingsDto.defaultCurrency;
    }
    if (updateSettingsDto.theme !== undefined) {
      data.theme = updateSettingsDto.theme;
    }
    if (updateSettingsDto.dateFormat !== undefined) {
      data.dateFormat = updateSettingsDto.dateFormat;
    }
    if (updateSettingsDto.language !== undefined) {
      data.language = updateSettingsDto.language;
    }
    if (updateSettingsDto.notificationsEnabled !== undefined) {
      data.notificationsEnabled = updateSettingsDto.notificationsEnabled;
    }

    const settings = await this.prisma.settings.update({
      where: { id: 1 },
      data,
    });

    return this.mapToResponse(settings);
  }

  private async mapToResponse(settings: any) {
    const currencies = await this.prisma.currency.findMany({
      orderBy: { code: 'asc' },
    });

    return {
      defaultCurrency: settings.defaultCurrency,
      currencies,
      theme: settings.theme,
      dateFormat: settings.dateFormat,
      language: settings.language,
      notificationsEnabled: settings.notificationsEnabled,
    };
  }
}
