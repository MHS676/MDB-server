import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    validateUser(dto: LoginDto): Promise<{
        id: number;
        email: string;
        name: string;
    }>;
}
