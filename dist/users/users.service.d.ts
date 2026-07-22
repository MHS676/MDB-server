import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        name: string;
        password: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
