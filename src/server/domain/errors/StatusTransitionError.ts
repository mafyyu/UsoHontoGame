/**
 * Status Transition Error
 * Represents errors that occur during game status transitions
 */

import type { GameStatusValue } from '../value-objects/GameStatus';

export type StatusTransitionErrorCode =
  | 'INVALID_STATUS_TRANSITION'
  | 'NO_PRESENTERS'
  | 'INCOMPLETE_PRESENTER'
  | 'INVALID_LIE_COUNT'
  | 'GAME_ALREADY_CLOSED'
  | 'UNAUTHORIZED';

/**
 * Error thrown when a status transition is not valid
 */
export class StatusTransitionError extends Error {
  public readonly code: StatusTransitionErrorCode;
  public readonly currentStatus: GameStatusValue;
  public readonly targetStatus?: GameStatusValue;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: StatusTransitionErrorCode,
    message: string,
    currentStatus: GameStatusValue,
    targetStatus?: GameStatusValue,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'StatusTransitionError';
    this.code = code;
    this.currentStatus = currentStatus;
    this.targetStatus = targetStatus;
    this.details = details;
  }

  /**
   * Factory method for invalid transition errors
   */
  static invalidTransition(
    currentStatus: GameStatusValue,
    targetStatus: GameStatusValue
  ): StatusTransitionError {
    return new StatusTransitionError(
      'INVALID_STATUS_TRANSITION',
      '無効なステータス遷移です',
      currentStatus,
      targetStatus
    );
  }

  /**
   * Factory method for missing presenters error
   */
  static noPresenters(currentStatus: GameStatusValue): StatusTransitionError {
    return new StatusTransitionError(
      'NO_PRESENTERS',
      'ゲームを開始するには出題者が必要です',
      currentStatus
    );
  }

  /**
   * Factory method for incomplete presenter error
   */
  static incompletePresenter(
    currentStatus: GameStatusValue,
    presenterNickname: string
  ): StatusTransitionError {
    return new StatusTransitionError(
      'INCOMPLETE_PRESENTER',
      `出題者 ${presenterNickname} のエピソードが不完全です`,
      currentStatus,
      undefined,
      { presenterNickname }
    );
  }

  /**
   * Factory method for invalid lie count error
   */
  static invalidLieCount(
    currentStatus: GameStatusValue,
    presenterNickname: string,
    lieCount: number
  ): StatusTransitionError {
    return new StatusTransitionError(
      'INVALID_LIE_COUNT',
      `出題者 ${presenterNickname} はウソを1つ選択する必要があります`,
      currentStatus,
      undefined,
      { presenterNickname, lieCount }
    );
  }

  /**
   * Factory method for already closed game error
   */
  static gameAlreadyClosed(): StatusTransitionError {
    return new StatusTransitionError(
      'GAME_ALREADY_CLOSED',
      '締切状態のゲームは変更できません',
      '締切'
    );
  }

  /**
   * Factory method for unauthorized error
   */
  static unauthorized(currentStatus: GameStatusValue): StatusTransitionError {
    return new StatusTransitionError(
      'UNAUTHORIZED',
      'このゲームを変更する権限がありません',
      currentStatus
    );
  }
}
