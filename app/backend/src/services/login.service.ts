import bcrypt = require('bcryptjs');
import AuthToken from '../token/token';
import User from '../database/models/User';
import verifyEmail from '../validation/validation';

interface IAuthToken {
  auth: boolean,
  user: string,
}

class LoginService {
  private email: string;

  private password: string;

  private token: string;

  async logining(email: string, password: string) {
    this.email = email;
    this.password = password;

    const resultEmail = await User.findAll({ where: { email } });

    if (!resultEmail.length) return false;

    if (!bcrypt.compareSync(this.password, resultEmail[0].password)) return false;

    const resultToken = AuthToken.createToken(resultEmail[0]);

    return { user: {
      id: resultEmail[0].id,
      username: resultEmail[0].username,
      role: resultEmail[0].role,
      email: resultEmail[0].email,
    },
    token: resultToken };
  }

  authEmail(email: string): true | false {
    this.email = email;
    const result = verifyEmail(email);
    if (!result) return false;
    return true;
  }

  async validateLogin(tokenHeader: string): Promise <false | IAuthToken> {
    this.token = tokenHeader;
    return AuthToken.authToken(this.token);
  }
}

export default new LoginService();
