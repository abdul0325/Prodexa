import { Module } from '@nestjs/common';
import { MLService } from './ml.service';
import { MLController } from './ml.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [MLService],
  controllers: [MLController]
})
export class MLModule { }
