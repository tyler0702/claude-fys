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
import { MunicipalitiesService } from './municipalities.service';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';

@Controller('municipalities')
export class MunicipalitiesController {
  constructor(private readonly municipalitiesService: MunicipalitiesService) {}

  @Post()
  async create(@Body() createMunicipalityDto: CreateMunicipalityDto) {
    try {
      return await this.municipalitiesService.create(createMunicipalityDto);
    } catch (error) {
      console.error('Municipality creation error:', error);
      throw new InternalServerErrorException('Failed to create municipality');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.municipalitiesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve municipalities',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const municipality = await this.municipalitiesService.findOne(+id);
      if (!municipality) {
        throw new NotFoundException(`Municipality with ID ${id} not found`);
      }
      return municipality;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve municipality');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMunicipalityDto: UpdateMunicipalityDto,
  ) {
    try {
      const updatedMunicipality = await this.municipalitiesService.update(
        +id,
        updateMunicipalityDto,
      );
      if (!updatedMunicipality) {
        throw new NotFoundException(`Municipality with ID ${id} not found`);
      }
      return updatedMunicipality;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update municipality');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedMunicipality = await this.municipalitiesService.remove(+id);
      if (!deletedMunicipality) {
        throw new NotFoundException(`Municipality with ID ${id} not found`);
      }
      return { message: 'Municipality deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete municipality');
    }
  }
}
