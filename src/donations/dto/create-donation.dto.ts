import { IsNumber, IsPositive, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateDonationDto {
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(Status)
  status: Status;
}
