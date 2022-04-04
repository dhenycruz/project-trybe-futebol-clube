import Club from '../database/models/club';

interface Iclub {
  id: number;
  clubName: string;
}

export default class ClubService {
  private clubs: Iclub[];

  private club: Iclub;

  async get(id:number): Promise<Iclub | false > {
    const club = await Club.findOne({ where: { id } });
    if (!club) return false;

    this.club = club;
    return club as Iclub;
  }

  async getAll(): Promise<Iclub[]> {
    const clubs = await Club.findAll();
    this.clubs = clubs;
    return clubs;
  }
}
