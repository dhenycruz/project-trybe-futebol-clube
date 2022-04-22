import fs = require('fs');
import jwt = require('jsonwebtoken');
import modelUser from '../database/models/User';
import { Iuser } from '../interfaces/user.interface';

interface ReturnVerify {
  data: Iuser
}

interface Itoken {
  createToken(user: Iuser): string,
  authToken(token: string): void;
}

interface IAuthToken {
  auth: boolean,
  user: string,
}
class Token implements Itoken {
  private token: string;

  private authentication: boolean;

  createToken(user: Iuser): string {
    const secret = fs.readFileSync('./jwt.evaluation.key');
    const token = jwt.sign({ data: user }, secret, { expiresIn: '7d', algorithm: 'HS256' });
    this.token = token;
    return this.token;
  }

  async authToken(token: string): Promise <false | IAuthToken | undefined> {
    const secret = fs.readFileSync('./jwt.evaluation.key');
    try {
      const decodec = jwt.verify(token, secret) as ReturnVerify;

      const user = await modelUser.findAll({ where: {
        email: decodec.data.email,
      } });

      this.authentication = false;
      if (!user) return this.authentication;

      return {
        auth: true,
        user: decodec.data.role,
      };
    } catch (e) {
      console.log('');
    }
  }
}

export default new Token();
