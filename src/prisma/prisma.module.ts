import { Module } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Module({
    exports: [PrismaService],
    providers: [ PrismaService ]
})
export class PrismaModule {}
