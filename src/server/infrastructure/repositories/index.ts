// Repository Factory with Dependency Injection
// Feature: 002-game-preparation
// Provides game repository instances using Prisma

import type { IGameRepository } from '@/server/domain/repositories/IGameRepository';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaGameRepository } from './PrismaGameRepository';

/**
 * Singleton Prisma client instance
 */
let prismaClient: PrismaClient | null = null;

/**
 * Gets Prisma client instance (singleton)
 */
function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

/**
 * Creates game repository instance
 * @returns IGameRepository implementation using Prisma
 */
export function createGameRepository(): IGameRepository {
  return new PrismaGameRepository(getPrismaClient());
}

/**
 * Closes database connections (for testing and shutdown)
 */
export async function closeRepositoryConnections(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}

// Export repository implementation
export { PrismaGameRepository } from './PrismaGameRepository';
