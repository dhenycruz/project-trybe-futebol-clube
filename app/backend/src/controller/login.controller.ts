import LoginService from '../services/login.service';

const service = new LoginService();

interface Error {
  status: number;
  message: string;
}

export default class LoginController {
  private email: string;

  private passowrd: string;

  async logining(email: string, password: string) {
    this.email = email;
    this.passowrd = password;
    const result = service.logining(this.email, this.passowrd);
    return result;
  }

  verifyEmail(email: string): Error | true {
    this.email = email;
    const result = service.authEmail(email);

    if (!result) return { status: 401, message: 'Incorrect email or password' };

    return true;
  }
}
