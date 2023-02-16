import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isValid = await super.canActivate(context);
    if (!isValid) {
      return false;
    }



    // Get bearer token from request
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    const token = bearerToken.split(' ')[1];
    const user = request.user;
    const email = user.email;
    

    // Check if token is valid
    const isValidToken = this.authService.isValidateToken(email, token);
    if (!isValidToken) {
      return false;
    }


    return true;
  }
}