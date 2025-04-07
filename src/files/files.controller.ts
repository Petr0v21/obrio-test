import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UploadLinksDto } from './dto/upload-links.dto';
import { QueryPaginatedDto } from 'src/common/dto/pagination.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-links')
  async uploadFilesFromLinks(@Body() { links, isSync }: UploadLinksDto) {
    if (isSync) {
      return await Promise.allSettled(
        links.map((link) => this.filesService.uploadFromLink(link)),
      );
    }
    for (let i = 0; i < links.length; i++) {
      await this.filesService.enqueueFileUpload(links[i]);
    }
    return { status: 'queued', total: links.length };
  }

  @Get()
  async getFiles(
    @Query(new ValidationPipe({ transform: true })) query: QueryPaginatedDto,
  ) {
    return this.filesService.listUploadedFiles(query);
  }
}
