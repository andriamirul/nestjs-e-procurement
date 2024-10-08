export abstract class PaginateResponseDto<T> {
  abstract data: T[];

  total: number;

  constructor(args: PaginateResponseDto<T>) {
    Object.assign(this, args);
  }
}
