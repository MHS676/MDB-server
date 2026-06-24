import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user && user.password === dto.secretPass) {
      return { id: user.id, email: user.email, name: user.name };
    }
    throw new UnauthorizedException('Invalid security access credentials');
  }
}