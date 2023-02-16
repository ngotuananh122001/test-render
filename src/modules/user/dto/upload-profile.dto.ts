import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
export class UploadProfileDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly fullName: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly contact: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly dob: Date;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly address: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false
  })
  @IsOptional()
  avatarImg: Express.Multer.File
}