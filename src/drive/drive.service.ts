import { Inject, Injectable, Logger } from '@nestjs/common';
import { DRIVE_CLIENT } from './drive.constants';
import { drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { DriveFile, DriveFileLinks } from './drive';

@Injectable()
export class DriveService {
  private readonly logger = new Logger(DriveService.name);

  constructor(@Inject(DRIVE_CLIENT) private readonly drive: drive_v3.Drive) {}

  private async makePublic(fileId: string): Promise<void> {
    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    this.logger.log(`File ${fileId} has become public!`);
  }

  async getFileLinks(fileId: string): Promise<DriveFileLinks> {
    const { data } = await this.drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    });

    if (!data.webContentLink && !data.webViewLink) {
      throw new Error('Can`t find file by fileId: ' + fileId);
    }

    return {
      webViewLink: data.webViewLink,
      webContentLink: data.webContentLink,
    };
  }

  async uploadFile(
    fileStream: Readable,
    fileName: string,
    mimeType: string,
  ): Promise<DriveFile> {
    const res = await this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType,
      },
      media: {
        mimeType,
        body: fileStream,
      },
      fields: 'id',
    });

    if (!res.data.id) {
      this.logger.error('Unsuccess upload file', res);
      throw new Error('Unsuccess upload file');
    }
    const fileId = res.data.id;
    await this.makePublic(fileId);
    const { webContentLink, webViewLink } = await this.getFileLinks(fileId);

    return {
      fileId: res.data.id,
      webViewLink,
      webContentLink,
    };
  }
}
