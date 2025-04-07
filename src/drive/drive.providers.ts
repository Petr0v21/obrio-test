import { Provider } from '@nestjs/common';
import { google } from 'googleapis';
import { DRIVE_CLIENT, DRIVE_MODULE_OPTIONS } from './drive.constants';
import { DriveModuleOptions } from './drive.interfaces';

export const createDriveClientProvider = (): Provider => ({
  provide: DRIVE_CLIENT,
  useFactory: async (options: DriveModuleOptions) => {
    const auth = new google.auth.JWT({
      email: options.clientEmail,
      key: options.privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    return google.drive({ version: 'v3', auth });
  },
  inject: [DRIVE_MODULE_OPTIONS],
});
