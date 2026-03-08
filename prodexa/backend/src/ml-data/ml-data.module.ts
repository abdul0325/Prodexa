import { Module } from '@nestjs/common';
import { MLDataService } from './ml-data.service';
import { MLDataController } from './ml-data.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MLDataService],
  controllers: [MLDataController]
})
export class MLDataModule { }
