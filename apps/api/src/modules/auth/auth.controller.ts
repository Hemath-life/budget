import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { GoogleAuthGuard } from './google-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Query('error') error: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const frontendUrl = (
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ).trim();

    // Handle OAuth errors (user denied access or other errors)
    if (error) {
      const errorMessage =
        error === 'access_denied'
          ? 'You denied access to your Google account'
          : `Authentication failed: ${error}`;
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent(errorMessage)}`,
      );
    }

    // If no user (guard didn't run or failed), redirect with error
    if (!req.user) {
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent('Authentication failed')}`,
      );
    }

    const result = await this.authService.googleLogin(req.user);

    // Redirect to frontend with token
    const redirectUrl = `${frontendUrl}/auth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;

    return res.redirect(redirectUrl);
  }
}
