import bcryptjs = require('bcryptjs');
import fs = require('fs');
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

    if (!resultEmail.length) return false;

    const comp = bcryptjs.compareSync(this.password, resultEmail[0].password);

    if (!comp) return false;

    const resultToken = token.createToken(resultEmail[0]);

    fs.writeFileSync('./jwt.evaluation.key', JSON.stringify(resultToken));

    return { user: {
      id: resultEmail[0].id,
      username: resultEmail[0].username,
      role: resultEmail[0].role,
      email: resultEmail[0].email,
    },
    token: resultToken };
  }
}
