import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ChangePwdDto {
  @ApiProperty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'a password between 6 to 20 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' })
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @ApiProperty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'a password between 6 to 20 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' })
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}