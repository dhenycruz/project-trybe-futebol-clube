import LoginService from '../services/login.service';

const service = new LoginService();

interface Error {
  status: number;
  message: string;
}

export default class LoginController {
  private email: string;

  private passowrd: string;

  private token: string;

  async logining(email: string, password: string) {
    this.email = email;
    this.passowrd = password;
    const result = await service.logining(this.email, this.passowrd);
    console.log(result);
    if (result === false) return { status: 401, message: 'Incorrect email or password' };

    return result;
  }

  verifyEmail(email: string): Error | true {
    this.email = email;

    console.log(typeof email);

    if (!email) return { status: 401, message: 'All fields must be filled' };

    const result = service.authEmail(email);

    if (!result) return { status: 401, message: 'Incorrect email or password' };

    return true;
  }

  verifyPassword(passowrd: string) {
    this.passowrd = passowrd;

    if (!passowrd) return { status: 401, message: 'All fields must be filled' };

    return true;
  }

  async validateLogin(tokenHeader: string) {
    this.token = tokenHeader;

    const result = await service.validateLogin(this.token);

    if (result === false) return { status: 401, message: 'Token invalid!' };

    return result.user;
  }
}
