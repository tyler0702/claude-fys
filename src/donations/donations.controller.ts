import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async create(@Body() createDonationDto: CreateDonationDto) {
    try {
      return await this.donationsService.create(createDonationDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create donation');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.donationsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve donations');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const donation = await this.donationsService.findOne(+id);
      if (!donation) {
        throw new NotFoundException(`Donation with ID ${id} not found`);
      }
      return donation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve donation');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    try {
      const updatedDonation = await this.donationsService.update(
        +id,
        updateDonationDto,
      );
      if (!updatedDonation) {
        throw new NotFoundException(`Donation with ID ${id} not found`);
      }
      return updatedDonation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update donation');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedDonation = await this.donationsService.remove(+id);
      if (!deletedDonation) {
        throw new NotFoundException(`Donation with ID ${id} not found`);
      }
      return { message: 'Donation deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete donation');
    }
  }
}
