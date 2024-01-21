import { Body, Controller, DefaultValuePipe, Get, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ChangePwdDto } from "./dto/change-pwd.dto";
import { ForgotPwdDto } from "./dto/forgot-pwd.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPwdDto } from "./dto/reset-pwd.dto";
import { UploadProfileDto } from "./dto/upload-profile.dto";
import { UserService } from "./user.service";
import { AuthTwitterGuard } from "../auth/guards/twitter.guard";

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post('/register')
  @ApiOperation({
    summary: 'Register',
    description: 'Create a new user',
  })
  async register(@Body() data: RegisterDto) {
    return this.userService.register(data);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
    description: 'Login',
  })
  async login(@Body() data: LoginDto) {
    return this.userService.login(data);
  }

  @Get('/login-by-twitter')
  @ApiOperation({
    summary: 'Login',
    description: 'Login',
  })
  @UseGuards(AuthTwitterGuard)
  async loginByTwitter() {
    return;
  }

  @Get('/twitter/callback')
  @ApiOperation({
    summary: 'callback',
    description: 'callback',
  })
  @UseGuards(AuthTwitterGuard)
  async twitterCallback(@Req() req) {
    return 'Login by twitter success';
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get current user',
  })
  async me(@Req() req) {
    return this.userService.me(req.user);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout',
  })
  async logout(@Req() req) {
    return this.userService.logout(req.user);
  }

  @Post('/upload-profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @UseInterceptors(FileInterceptor('avatarImg'))
  @ApiOperation({
    summary: 'Upload profile',
    description: 'Upload profile',
  })
  @ApiConsumes('multipart/form-data')
  async uploadProfile(
    @Body() data: UploadProfileDto,
    @UploadedFile() avatarImg: Express.Multer.File,
    @Req() req) {
    return this.userService.uploadProfile(data, avatarImg, req.user);
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({
    summary: 'Change password',
    description: 'Change password',
  })
  async changePassword(
    @Body() data: ChangePwdDto,
    @Req() req
  ) {
    return this.userService.changePassword(data, req.user);
  }

  @Post('/forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Forgot password',
  })
  async forgotPassword(
    @Body() data: ForgotPwdDto
  ) {
    return this.userService.forgotPassword(data);
  }

  @Post('/reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset password',
  })
  async resetPassword(
    @Body() data: ResetPwdDto
  ) {
    return this.userService.resetPassword(data);
  }
}