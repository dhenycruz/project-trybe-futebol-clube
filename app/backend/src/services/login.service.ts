import AuthToken from '../token/token';
import User from '../database/models/user';

const token = new AuthToken();

export default class LoginService {
  private email: string;

  private password: string;

  /* constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  } */

  async logining(email: string, password: string) {
    this.email = email;
    this.password = password;

    const resultEmail = await User.findAll({ where: { email } });
    const resultPassword = await User.findAll({ where: { password } });

    if (!resultEmail.length || !resultPassword.length) return false;

    const resultToken = token.createToken(resultEmail[0]);

    return { user: resultEmail[0], token: resultToken };
  }
}
