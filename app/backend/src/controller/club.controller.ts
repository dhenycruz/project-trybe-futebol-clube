import ClubService from '../services/club.service';

const service = new ClubService();

interface Iclub {
  id: number;
  clubName: string;
}

export default class ClubController {
  private clubs: Iclub[];

  async getAll(): Promise<Iclub[]> {
    const clubs = await service.getAll();
    this.clubs = clubs;
    return this.clubs as Iclub[];
  }
}
