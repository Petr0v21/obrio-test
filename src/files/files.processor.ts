import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { FilesService } from './files.service';
import { Logger } from '@nestjs/common';

@Processor('files-queue')
export class FilesProcessor {
  private readonly logger = new Logger(FilesProcessor.name);

  constructor(private readonly filesService: FilesService) {}

  @Process('download-and-upload')
  async handleFileUpload(
    job: Job<{
      url: string;
    }>,
  ) {
    const { url } = job.data;
    try {
      return await this.filesService.uploadFromLink(url);
    } catch (err) {
      this.logger.error('Error during handleFileUpload by ', err);
      throw err;
    }
  }
}
