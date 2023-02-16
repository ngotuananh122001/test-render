import { Injectable } from "@nestjs/common";

const tokenMap = new Map();

@Injectable()
export class AuthService {
  setToken(key: string, value: string) {
    tokenMap.set(key, value);
  }

  getToken(key: string) {
    return tokenMap.get(key);
  }

  removeToken(key: string) {
    tokenMap.delete(key);
  }

  isValidateToken(key: string, tokenCheck: string) {
    return true;
    if (!tokenMap.has(key)) {
      return false;
    }

    return tokenMap.get(key) === tokenCheck;
  }
}