import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/models/player.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) { }

  async createPlayer(data: CreatePlayerDto) {
    return await this.playerRepository.save(data);
  }

  async findAllPlayers(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const [players, total] = await this.playerRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return {
      data: players,
      count: total,
    };
  }

  async findOnePlayer(id: number) {
    const player = await this.playerRepository.findOneBy({ id });

    if (!player) {
      throw new NotFoundException('Player not found');
    } else {
      return await player;
    }
  }

  async findOnePlayerByTeam(data, toCreate = false) {
    const player = await this.playerRepository.find({
      where: {
        id: data.id,
        playerToTeams: {
          id: data.team_id,
        },
      },
    });

    if ((!player || !player.length) && !toCreate) {
      throw new NotFoundException('Player not linked with this team');
    } else {
      return await player;
    }
  }

  async updatePlayer(id: number, data: UpdatePlayerDto) {
    this.findOnePlayer(id);

    return await this.playerRepository.update(id, data);
  }

  async removePlayer(id: number) {
    this.findOnePlayer(id);

    return await this.playerRepository.delete(id);
  }
}
