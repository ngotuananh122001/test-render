import { HttpException, HttpStatus } from '@nestjs/common';

export class Causes {
  public static USER_EXISTED = new HttpException(
    'User existed',
    HttpStatus.BAD_REQUEST,
  );

  public static USER_NOT_FOUND = new HttpException(
    'User not found',
    HttpStatus.BAD_REQUEST,
  );

  public static USER_INVALID = new HttpException(
    'User or password invalid',
    HttpStatus.BAD_REQUEST,
  );

  public static FILE_SIZE_OVER = new HttpException(
    ['Upload file size exceeds the allowed limit'],
    HttpStatus.BAD_REQUEST,
  );

  public static FILE_TYPE_INVALID = new HttpException(
    ['File type upload invalid'],
    HttpStatus.BAD_REQUEST,
  );

  public static NOT_PERMITTED = new HttpException(
    ['Not permitted'],
    HttpStatus.UNAUTHORIZED,
  );

  public static TOKEN_EXPIRED = new HttpException(
    ['Token expired'],
    HttpStatus.BAD_REQUEST,
  );
}
