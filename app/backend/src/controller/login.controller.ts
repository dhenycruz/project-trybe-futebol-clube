import LoginService from '../services/login.service';

export default class LoginController {
  readonly service: LoginService;

  async logining(email: string, password: string) {
    const result = this.service.logining(email, password);
    return result;
  }
}
