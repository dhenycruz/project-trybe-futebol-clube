import service from '../services/club.service';

interface Iclub {
  id: number;
  clubName: string;
}

class ClubController {
  private clubs: Iclub[];

  private club: Iclub;

  async get(id: number): Promise<Iclub | false> {
    const club = await service.get(id);
    if (!club) return false;
    this.club = club;
    return club;
  }

  async getAll(): Promise<Iclub[]> {
    const clubs = await service.getAll();
    this.clubs = clubs;
    return this.clubs;
  }
}

export default new ClubController();
