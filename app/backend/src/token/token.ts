import jwt = require('jsonwebtoken');
import modelUser from '../database/models/user';
import { Iuser } from '../interfaces/user.interface';

const secret = 'mysecret';

interface ReturnVerify {
  data: Iuser
}

interface Itoken {
  createToken(user: Iuser): string,
  authToken(token: string): Promise<boolean>
}

export default class Token implements Itoken {
  private token: string;

  private authentication: boolean;

  createToken(user: Iuser): string {
    const token = jwt.sign({ data: user }, secret, { expiresIn: '7d', algorithm: 'HS256' });
    this.token = token;
    return this.token;
  }

  async authToken(token: string): Promise <boolean> {
    const decodec = jwt.verify(token, secret) as ReturnVerify;
    const user = await modelUser.findAll({ where: {
      email: decodec.data.email,
    } });

    if (!user) return !this.authentication;
    return this.authentication;
  }
}
