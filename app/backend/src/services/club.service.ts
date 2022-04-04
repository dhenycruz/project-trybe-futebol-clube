import Club from '../database/models/club';

interface Iclub {
  id: number;
  clubName: string;
}

export default class ClubService {
  private clubs: Iclub[];

  async getAll(): Promise<Iclub[]> {
    const clubs = await Club.findAll();
    this.clubs = clubs;
    return clubs;
  }
}
