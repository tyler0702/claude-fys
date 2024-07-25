import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';

@Injectable()
export class MunicipalitiesService {
  constructor(private prisma: PrismaService) {}

  create(createMunicipalityDto: CreateMunicipalityDto) {
    return this.prisma.municipality.create({
      data: createMunicipalityDto,
    });
  }

  findAll() {
    return this.prisma.municipality.findMany();
  }

  findOne(id: number) {
    return this.prisma.municipality.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMunicipalityDto: UpdateMunicipalityDto) {
    return this.prisma.municipality.update({
      where: { id },
      data: updateMunicipalityDto,
    });
  }

  remove(id: number) {
    return this.prisma.municipality.delete({
      where: { id },
    });
  }
}
