import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
    const { password, ...result } = user;
    return result;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUserId: number,
  ): Promise<Omit<User, 'password'>> {
    if (id !== currentUserId) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(
    id: number,
    currentUserId: number,
  ): Promise<Omit<User, 'password'>> {
    if (id !== currentUserId) {
      throw new UnauthorizedException('You can only delete your own account');
    }

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });
    const { password, ...result } = deletedUser;
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
    currentUserId: number,
  ): Promise<boolean> {
    if (id !== currentUserId) {
      throw new UnauthorizedException('You can only change your own password');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });
    return true;
  }

  async findOneWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
