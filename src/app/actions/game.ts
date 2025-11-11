"use server";

// Game Server Actions
// Feature: 002-game-preparation
// Server Actions with Zod validation for game management

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreateGame } from "@/server/application/use-cases/games/CreateGame";
import { StartAcceptingResponses } from "@/server/application/use-cases/games/StartAcceptingResponses";
import { CloseGame } from "@/server/application/use-cases/games/CloseGame";
import { createGameRepository } from "@/server/infrastructure/repositories";
import { CreateGameSchema, StartAcceptingSchema } from "@/server/domain/schemas/gameSchemas";
import type { CreateGameOutput } from "@/server/application/dto/GameDto";
import {getCookie} from "@/lib/cookies";
import {COOKIE_NAMES} from "@/lib/constants";

/**
 * Server Action: Create new game
 * Validates input with Zod, creates game via CreateGame use case
 * @param formData Form data from GameForm
 * @returns Created game data or validation errors
 */
export async function createGameAction(
	formData: FormData,
): Promise<
	| { success: true; game: CreateGameOutput }
	| { success: false; errors: Record<string, string[]> }
> {
	try {
		// Extract and parse form data
		const rawData = {
			playerLimit: Number(formData.get("playerLimit")),
		};

		// Validate with Zod schema
		const validationResult = CreateGameSchema.safeParse(rawData);

		if (!validationResult.success) {
			return {
				success: false,
				errors: validationResult.error.flatten().fieldErrors,
			};
		}

		// Get session ID from cookies (moderator/creator ID)
        const sessionId = await getCookie(COOKIE_NAMES.SESSION_ID);

		if (!sessionId) {
			return {
				success: false,
				errors: {
					_form: ["セッションが見つかりません。ニックネームを設定してください。"],
				},
			};
		}

		// Execute CreateGame use case
		const repository = createGameRepository();
		const useCase = new CreateGame(repository);

		const game = await useCase.execute({
			creatorId: sessionId,
			playerLimit: validationResult.data.playerLimit,
		});

		return {
			success: true,
			game,
		};
	} catch (error) {
		console.error("Failed to create game:", error);
		return {
			success: false,
			errors: {
				_form: [
					error instanceof Error
						? error.message
						: "ゲームの作成に失敗しました",
				],
			},
		};
	}
}

/**
 * Server Action: Create game and redirect to game list
 * Convenience wrapper that redirects on success
 * @param formData Form data from GameForm
 */
export async function createGameAndRedirect(
	formData: FormData,
): Promise<void> {
	const result = await createGameAction(formData);

	if (result.success) {
		// Redirect to game list or game detail page
		redirect("/");
	}

	// On failure, let the form component handle errors
	// This should not happen as the form will call createGameAction directly
	throw new Error("Game creation failed");
}

/**
 * Server Action: Start accepting responses
 * Transitions game from 準備中 to 出題中
 * @param formData Form data with gameId
 * @returns Success status or validation errors
 */
export async function startAcceptingAction(
	formData: FormData,
): Promise<
	| { success: true }
	| { success: false; errors: Record<string, string[]> }
> {
	try {
		// Extract and validate form data
		const rawData = {
			gameId: formData.get("gameId"),
		};

		const validationResult = StartAcceptingSchema.safeParse(rawData);

		if (!validationResult.success) {
			return {
				success: false,
				errors: validationResult.error.flatten().fieldErrors,
			};
		}

		// Get session ID (for authorization)
		const sessionId = await getCookie(COOKIE_NAMES.SESSION_ID);

		if (!sessionId) {
			return {
				success: false,
				errors: {
					_form: ["セッションが見つかりません。ログインし直してください。"],
				},
			};
		}

		// Execute use case
		const repository = createGameRepository();
		const useCase = new StartAcceptingResponses(repository);

		await useCase.execute({
			gameId: validationResult.data.gameId,
		});

		return { success: true };
	} catch (error) {
		console.error("Failed to start accepting responses:", error);
		return {
			success: false,
			errors: {
				_form: [
					error instanceof Error
						? error.message
						: "ステータスの変更に失敗しました",
				],
			},
		};
	}
}

/**
 * Server Action: Close game
 * Transitions game from 出題中 to 締切
 * @param formData Form data with gameId
 * @returns Success status or validation errors
 */
export async function closeGameAction(
	formData: FormData,
): Promise<
	| { success: true }
	| { success: false; errors: Record<string, string[]> }
> {
	try {
		// Extract and validate form data
		const rawData = {
			gameId: formData.get("gameId"),
		};

		const validationResult = StartAcceptingSchema.safeParse(rawData);

		if (!validationResult.success) {
			return {
				success: false,
				errors: validationResult.error.flatten().fieldErrors,
			};
		}

		// Get session ID (for authorization)
		const sessionId = await getCookie(COOKIE_NAMES.SESSION_ID);

		if (!sessionId) {
			return {
				success: false,
				errors: {
					_form: ["セッションが見つかりません。ログインし直してください。"],
				},
			};
		}

		// Execute use case
		const repository = createGameRepository();
		const useCase = new CloseGame(repository);

		await useCase.execute({
			gameId: validationResult.data.gameId,
		});

		return { success: true };
	} catch (error) {
		console.error("Failed to close game:", error);
		return {
			success: false,
			errors: {
				_form: [
					error instanceof Error
						? error.message
						: "ゲームの締切に失敗しました",
				],
			},
		};
	}
}
