import { HttpException, HttpStatus, Injectable, Redirect, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';
import { ResetPassword, User } from "src/database/entities";
import { LoginDto } from "./dto/login.dto";
import { Causes } from "src/config/exception/causes";
import { RegisterDto } from "./dto/register.dto";
import { Role } from "../auth/enums/role.enum";
import { AuthService } from "../auth/auth.service";
import { UploadProfileDto } from "./dto/upload-profile.dto";
import { checkImage } from "src/shared/Utils";
import { ChangePwdDto } from "./dto/change-pwd.dto";
import { ForgotPwdDto } from "./dto/forgot-pwd.dto";
import { MailService } from "../mail/mail.service";
import { ResetPwdDto } from "./dto/reset-pwd.dto";

@Injectable()
export class UserService {
    constructor(
      private jwtService: JwtService,

      private authServer: AuthService,

      private mailService: MailService,

      @InjectRepository(User)
      private usersRepository: Repository<User>,

      @InjectRepository(ResetPassword)
      private resetPasswordRepository: Repository<ResetPassword>
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
      roles: [Role.User]
    });

    await this.usersRepository.save(newUser);

    let { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user || null;
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

    const isUser = user.roles.some(role => role === Role.User);
    if (!isUser) {
      throw new HttpException(
        'You are not user',
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

    const { password, ...userWithoutPassword } = user;

    return {
      accessToken,
      ...userWithoutPassword,
    }
  }

  async logout(user: User) {
    return this.authServer.removeToken(user.email);
  }

  async uploadProfile(
    data: UploadProfileDto,
    avatarImg: Express.Multer.File,
    user: User
  ) {

    let avatarUrl = '';
    if (avatarImg) {
      avatarUrl = await this.uploadPublicFile(avatarImg);
      if (!avatarUrl || avatarUrl === '') {
        throw new HttpException(
          'Upload avatar failed',
          HttpStatus.BAD_REQUEST);
      }
    }

    const updateUser = this.usersRepository.create({
      ...user,
      fullName: data.fullName,
      contact: data.contact,
      dob: data.dob,
      phone: data.phone,
      address: data.address,
      avatarUrl: avatarUrl ? avatarUrl : user.avatarUrl,
    });

    await this.usersRepository.save(updateUser);
    const { password, ...userWithoutPassword } = updateUser;
    return userWithoutPassword;
  }

  async uploadPublicFile(file: Express.Multer.File) {
    if (!checkImage(file)) {
      throw new HttpException('Invalid image', HttpStatus.BAD_REQUEST);
    }

    const { originalname, buffer } = file;
    const fileName = originalname.replace(/\s/g, '-');

    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: process.env.AWS_BUCKET,
      Key: `${uuid()}-${fileName}`,
      Body: buffer,
    }).promise();

    return uploadResult.Location;
  }

  async changePassword(data: ChangePwdDto, user: User) {
    let isPasswordMatch = await argon2.verify(user.password, data.oldPassword);
    if (!isPasswordMatch) {
      throw new HttpException(
        'Old password is not correct',
        HttpStatus.BAD_REQUEST
      )
    }

    let hashPassword = await argon2.hash(data.newPassword);
    const updateUser = this.usersRepository.create({
      ...user,
      password: hashPassword,
    });

    await this.usersRepository.save(updateUser);
    const { password, ...userWithoutPassword } = updateUser;
    return userWithoutPassword;
  }

  async forgotPassword(data: ForgotPwdDto) {
    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw Causes.USER_NOT_FOUND;
    }

    await this.resetPasswordRepository.delete({ email: data.email });

    const tokenWithoutHash = uuid();
    const token = await argon2.hash(tokenWithoutHash);
    const newRestPwd = await this.resetPasswordRepository.create({
      email: data.email,
      token: token,
      expiredAt: new Date(Date.now() + 3600000)
    });
    await this.resetPasswordRepository.save(newRestPwd);

    const resetPwdURL = `${process.env.URL_FRONTEND}/passwordReset?token=${tokenWithoutHash}&email=${data.email}`;

    await this.mailService.sendResetPassword(
      data.email,
      'Password Reset Request',
      resetPwdURL
    );
  }

  async resetPassword(data: ResetPwdDto) {
    const { email, token, password } = data;

    const resetPwd = await this.resetPasswordRepository.findOneBy({ email });
    if (!resetPwd || resetPwd.expiredAt < new Date()) {
      throw new HttpException(
        'Token is invalid or expired',
        HttpStatus.BAD_REQUEST
      )
    }

    const isTokenMatch = await argon2.verify(resetPwd.token, token);
    if (!isTokenMatch) {
      throw new HttpException(
        'Token is invalid or expired',
        HttpStatus.BAD_REQUEST
      )
    }

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw Causes.USER_NOT_FOUND;
    }

    const hashPassword = await argon2.hash(password);
    const updateUser = this.usersRepository.create({
      ...user,
      password: hashPassword,
    });

    await this.usersRepository.save(updateUser);
    const { password: _, ...userWithoutPassword } = updateUser;
    return userWithoutPassword;
  }

  async me(user: User) {
    const { password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
    }
  }

  
}