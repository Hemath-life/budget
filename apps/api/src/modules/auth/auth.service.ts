import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

export interface GoogleUser {
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersService.findOne(signupDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const user = await this.usersService.create({
      email: signupDto.email,
      password: hashedPassword,
      name: signupDto.name,
    });
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateGoogleUser(googleUser: GoogleUser) {
    // Check if user exists by provider ID
    let user = await this.usersService.findByProvider(
      googleUser.provider,
      googleUser.providerId,
    );

    if (!user) {
      // Check if user exists by email (might have signed up with email/password)
      user = await this.usersService.findOne(googleUser.email);

      if (user) {
        // Link Google account to existing user
        user = await this.usersService.updateProvider(
          user.id,
          googleUser.provider,
          googleUser.providerId,
          googleUser.avatar,
        );
      } else {
        // Create new user with Google account
        user = await this.usersService.create({
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          provider: googleUser.provider,
          providerId: googleUser.providerId,
        });
      }
    }

    return user;
  }

  async googleLogin(googleUser: GoogleUser) {
    const user = await this.validateGoogleUser(googleUser);
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }
}
