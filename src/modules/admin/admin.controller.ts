import { Body, Controller, Get, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AdminService } from "../admin/admin.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";


@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) { }

  @Post('/register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SupperAdmin)
  @ApiOperation({
    summary: 'Register',
    description: 'Create a new admin',
  })
  async register(@Body() data: RegisterDto) {
    return this.adminService.register(data);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
    description: 'Login',
  })
  async login(@Body() data: LoginDto) {
    return this.adminService.login(data);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get current admin',
    description: 'Get current admin',
  })
  async me(@Req() req) {
    const { password, ...userWithoutPassword } = req.user;
    return userWithoutPassword;
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout',
  })
  async logout(@Req() req) {
    return this.adminService.logout(req.user);
  }

  @Get('/all-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  @ApiQuery({
    name: 'page',
    required: false
  })
  @ApiQuery({
    name: 'limit',
    required: false
  })
  async getUsers(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1000
  ) {
    return this.adminService.getUsers({ page, limit});
  }


}