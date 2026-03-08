import { Module } from '@nestjs/common';
import { IntelligenceService } from './intelligence.service';
import { IntelligenceController, MLDataController } from './intelligence.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [IntelligenceService],
  controllers: [IntelligenceController, MLDataController],
})
export class IntelligenceModule {}