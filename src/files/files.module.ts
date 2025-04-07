import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { DriveModule } from 'src/drive/drive.module';
import { PrismaModule } from 'prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { FilesProcessor } from './files.processor';

@Module({
  imports: [
    DriveModule,
    PrismaModule,
    BullModule.registerQueue({
      name: 'files-queue',
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, FilesProcessor],
})
export class FilesModule {}
