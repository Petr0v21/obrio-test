import { Type } from 'class-transformer';
import { Min, IsOptional, IsInt, Max, IsEnum } from 'class-validator';

// export class QueryPaginatedDto {
//   constructor(args?: { page?: number; take?: number; skip?: number }) {
//     if (!args) {
//       this.page = 1;
//       this.take = 20;
//       return;
//     }
//     const { page, take, skip } = args;
//     if (page && take) {
//       this.page = page;
//       this.take = take;
//     } else if (take && skip) {
//       if (skip !== 0 && skip % take !== 0) {
//         throw new Error('skip must be a multiple of take');
//       }
//       this.take = take;
//       this.page = skip / take + 1;
//     } else {
//       this.page = page ?? 1;
//       this.take = take ?? 20;
//     }
//   }

//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @IsOptional()
//   page?: number = 1;

//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @Max(100)
//   @IsOptional()
//   take?: number = 20;

//   get skip(): number {
//     return (this.page - 1) * this.take;
//   }

//   static getSkip(page: number, take: number): number {
//     return (page - 1) * take;
//   }
// }

export class QueryPaginatedDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  take: number = 20;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  static getSkip(page: number, take: number): number {
    return (page - 1) * take;
  }
}

export class PaginatedDto<T> {
  constructor(data: T[], total: number, paginatedQuery: QueryPaginatedDto) {
    this.total = total;
    this.data = data;
    this.take = paginatedQuery.take;
    this.page = paginatedQuery.page;
    this.totalPages = Math.ceil(total / paginatedQuery.take);
  }

  take: number;
  page: number;
  totalPages: number;
  total: number;
  data: T[];
}
