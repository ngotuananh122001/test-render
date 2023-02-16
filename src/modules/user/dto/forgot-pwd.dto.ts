import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ForgotPwdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}