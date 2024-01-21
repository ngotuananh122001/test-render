import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import * as argon2 from 'argon2';
import {  User  } from "src/database/entities";
import { LoginDto } from "./dto/login.dto";
import { Causes } from "src/config/exception/causes";
import { RegisterDto } from "./dto/register.dto";
import { Role } from "../auth/enums/role.enum";
import { AuthService } from "../auth/auth.service";
import { paginate } from "nestjs-typeorm-paginate";

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,

    private authServer: AuthService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private dataSources: DataSource,
  ) { }

  async register(data: RegisterDto) {
    let duplicateUser = await this.findUserByEmail(data.email);
    if (duplicateUser) {
      throw Causes.USER_EXISTED;
    }

    let hashPassword = await argon2.hash(data.password);
    let newUser = this.usersRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: hashPassword,
      roles: [Role.Admin]
    });

    await this.usersRepository.save(newUser);

    let { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }



  async login(data: LoginDto) {
    let user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException();
    }


    let isPasswordMatch = await argon2.verify(user.password, data.password);
    if (!isPasswordMatch) {
      throw Causes.USER_INVALID;
    }

    const isAdmin = user.roles.some(role => role === Role.Admin);
    if (!isAdmin) {
      throw new HttpException(
        'You are not admin',
        HttpStatus.UNAUTHORIZED
      )
    }


    let payload = {
      id: user.id,
      email: user.email,
    };

    let accessToken;

    if (data.rememberMe === 'true') {
      accessToken = this.jwtService.sign(payload, {
        expiresIn: '7d'
      });
    } else {
      accessToken = this.jwtService.sign(payload);
    }

    this.authServer.setToken(payload.email, accessToken);

    return {
      accessToken,
    }
  }

  async logout(user: User) {
    return this.authServer.removeToken(user.email);
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user || null;
  }

  async getUsers({ page, limit }: { page: number, limit: number }) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('users')
      .where('users.roles LIKE :role', { role: `%${Role.User}%` })
      .orderBy('users.createdAt', 'DESC');
      
    return paginate(queryBuilder, { page, limit });
  }

}