import { Injectable, Logger } from '@nestjs/common';
import { DriveService } from '../drive/drive.service';
import { fetchFileStream } from 'src/utils/fetchFileStream';
import { PrismaService } from 'prisma/prisma.service';
import { PaginatedDto, QueryPaginatedDto } from 'src/common/dto/pagination.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly driveService: DriveService,
    private readonly prismaService: PrismaService,
    @InjectQueue('files-queue') private readonly filesQueue: Queue,
  ) {}

  async uploadFromLink(link: string) {
    try {
      const isExist = await this.prismaService.file.findUnique({
        where: {
          originalUrl: link,
        },
      });

      if (isExist) {
        return isExist;
      }

      const { stream, fileName, mimeType } = await fetchFileStream(link);

      const uploadResult = await this.driveService.uploadFile(
        stream,
        fileName,
        mimeType,
      );

      const result = await this.prismaService.file.create({
        data: {
          driveFileId: uploadResult.fileId,
          driveLink: uploadResult.webContentLink,
          fileName,
          mimeType,
          originalUrl: link,
        },
      });

      this.logger.log(`Uploaded file from ${link} as ${fileName}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to upload file from ${link}: ${error.message}`);
      throw error;
    }
  }

  async listUploadedFiles(query: QueryPaginatedDto) {
    const [data, total] = await Promise.all([
      this.prismaService.file.findMany({
        take: query.take,
        skip: query.skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.file.count(),
    ]);

    return new PaginatedDto(data, total, query);
  }

  async enqueueFileUpload(url: string) {
    await this.filesQueue.add(
      'download-and-upload',
      { url },
      {
        attempts: 2,
        backoff: 5000,
      },
    );
  }
}
