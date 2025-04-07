import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { DriveService } from './drive.service';
import { DRIVE_MODULE_OPTIONS } from './drive.constants';
import { createDriveClientProvider } from './drive.providers';
import { DriveModuleOptions } from './drive.interfaces';

@Global()
@Module({})
export class DriveModule {
  static forRootAsync(options: {
    imports?: any[];
    useFactory: (
      ...args: any[]
    ) => DriveModuleOptions | Promise<DriveModuleOptions>;
    inject?: any[];
  }): DynamicModule {
    const optionsProvider: Provider = {
      provide: DRIVE_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: DriveModule,
      imports: options.imports,
      providers: [optionsProvider, createDriveClientProvider(), DriveService],
      exports: [DriveService],
    };
  }
}
