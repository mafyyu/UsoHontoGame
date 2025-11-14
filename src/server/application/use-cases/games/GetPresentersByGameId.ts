// GetPresentersByGameId Use Case
// Feature: 002-game-preparation
// Business logic for retrieving all presenters for a game

import type { IGameRepository } from '@/server/domain/repositories/IGameRepository';
import type { EpisodeWithLieDto } from '../../dto/EpisodeWithLieDto';
import type { PresenterWithLieDto } from '../../dto/PresenterWithLieDto';

export interface GetPresentersByGameIdInput {
  /** Game ID to get presenters for */
  gameId: string;
  /** Requesting user's session ID (for access control) */
  requesterId: string;
}

export interface GetPresentersByGameIdOutput {
  /** All presenters for the game with their episodes */
  presenters: PresenterWithLieDto[];
}

/**
 * GetPresentersByGameId use case
 * Retrieves all presenters for a specific game with their episodes
 *
 * Access Control:
 * - Game creator/moderator: Can see all presenters and lie markers
 * - This use case assumes the caller has already verified access rights
 *
 * Note: Returns presenters with episodes including lie markers.
 * Access control enforcement happens at the Server Action layer.
 */
export class GetPresentersByGameId {
  constructor(private gameRepository: IGameRepository) {}

  async execute(input: GetPresentersByGameIdInput): Promise<GetPresentersByGameIdOutput> {
    const { gameId } = input;

    // Get all presenters for this game
    const presenterEntities = await this.gameRepository.findPresentersByGameId(gameId);

    // For each presenter, get their episodes and map to DTO
    const presenters: PresenterWithLieDto[] = await Promise.all(
      presenterEntities.map(async (presenterEntity) => {
        // Get episodes for this presenter
        const episodes = await this.gameRepository.findEpisodesByPresenterId(presenterEntity.id);

        // Map episodes to DTOs
        const episodeDtos: EpisodeWithLieDto[] = episodes.map((episode) => ({
          id: episode.id,
          presenterId: episode.presenterId,
          text: episode.text,
          isLie: episode.isLie,
          createdAt: episode.createdAt,
        }));

        // Map presenter to DTO
        return {
          id: presenterEntity.id,
          gameId: presenterEntity.gameId,
          nickname: presenterEntity.nickname,
          episodes: episodeDtos,
          createdAt: presenterEntity.createdAt,
        };
      })
    );

    return {
      presenters,
    };
  }
}
