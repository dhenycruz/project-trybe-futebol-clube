import LoginService from '../services/login.service';

const service = new LoginService();

export default class LoginController {
  private email: string;

  private passowrd: string;

  async logining(email: string, password: string) {
    this.email = email;
    this.passowrd = password;
    const result = service.logining(this.email, this.passowrd);
    return result;
  }
}
