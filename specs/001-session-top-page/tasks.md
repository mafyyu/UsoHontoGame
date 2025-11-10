# Tasks: Session Management and TOP Page

**Input**: Design documents from `/specs/001-session-top-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: TDD is MANDATORY per project constitution. Tests MUST be written FIRST (Red-Green-Refactor).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Single web application with Next.js App Router:
- Source code: `src/` at repository root
- Tests: `tests/` at repository root
- Structure follows plan.md: `src/app/`, `src/components/`, `src/server/`, `src/hooks/`, `src/lib/`, `src/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure for session management feature

- [ ] T001 Create type definitions directory structure: src/types/
- [ ] T002 [P] Create server domain directory structure: src/server/domain/entities/, src/server/domain/value-objects/, src/server/domain/repositories/
- [ ] T003 [P] Create server application directory structure: src/server/application/use-cases/session/, src/server/application/use-cases/games/, src/server/application/dto/
- [ ] T004 [P] Create server infrastructure directory structure: src/server/infrastructure/repositories/
- [ ] T005 [P] Create lib directory structure: src/lib/
- [ ] T006 [P] Create app actions directory structure: src/app/actions/
- [ ] T007 [P] Create components directory structure: src/components/pages/top/, src/components/domain/session/hooks/, src/components/domain/game/, src/components/ui/
- [ ] T008 [P] Create test directory structure: tests/unit/domain/, tests/unit/use-cases/, tests/unit/hooks/, tests/integration/repositories/, tests/integration/actions/, tests/e2e/
- [ ] T009 Verify Next.js 16, React 19, TypeScript 5, Vitest, Playwright are configured per package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Define SessionId, Nickname, SessionData types in src/types/session.ts
- [ ] T011 [P] Define GameStatus, GameSummary types in src/types/game.ts
- [ ] T012 [P] Define constants (cookie names, max age, nickname max length) in src/lib/constants.ts
- [ ] T013 Create cookie helper functions (getCookie, setCookie, deleteCookie) in src/lib/cookies.ts
- [ ] T014 [P] Define SessionDto interface in src/server/application/dto/SessionDto.ts
- [ ] T015 [P] Define GameDto interface in src/server/application/dto/GameDto.ts
- [ ] T016 Define ISessionRepository interface in src/server/domain/repositories/ISessionRepository.ts
- [ ] T017 [P] Define IGameRepository interface in src/server/domain/repositories/IGameRepository.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First-Time Visitor Creates Session (Priority: P1) 🎯 MVP

**Goal**: Users can establish persistent sessions with nicknames stored in cookies, creating the foundation for user identity in the system.

**Independent Test**: Visit application without any games created, verify session ID is assigned, set nickname, close/reopen browser, verify session persists for 30 days.

### Tests for User Story 1 (TDD: RED phase - write tests FIRST)

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation (constitution Principle IV)**

- [ ] T018 [P] [US1] Unit test for SessionId value object validation in tests/unit/domain/SessionId.test.ts
- [ ] T019 [P] [US1] Unit test for Nickname value object validation in tests/unit/domain/Nickname.test.ts
- [ ] T020 [P] [US1] Unit test for Session entity invariants in tests/unit/domain/Session.test.ts
- [ ] T021 [P] [US1] Unit test for CreateSession use case in tests/unit/use-cases/CreateSession.test.ts
- [ ] T022 [P] [US1] Unit test for ValidateSession use case in tests/unit/use-cases/ValidateSession.test.ts
- [ ] T023 [P] [US1] Unit test for SetNickname use case in tests/unit/use-cases/SetNickname.test.ts
- [ ] T024 [P] [US1] Unit test for useNicknameForm hook in tests/unit/hooks/useNicknameForm.test.ts
- [ ] T025 [P] [US1] Integration test for CookieSessionRepository in tests/integration/repositories/CookieSessionRepository.test.ts
- [ ] T026 [P] [US1] Integration test for session Server Actions in tests/integration/actions/session.test.ts
- [ ] T027 [US1] E2E test for session creation flow in tests/e2e/top-page.spec.ts (Acceptance Scenarios 1-4)

### Implementation for User Story 1 (TDD: GREEN phase - make tests pass)

#### Domain Layer (Value Objects and Entities)

- [ ] T028 [P] [US1] Implement SessionId value object with validation in src/server/domain/value-objects/SessionId.ts
- [ ] T029 [P] [US1] Implement Nickname value object with validation in src/server/domain/value-objects/Nickname.ts
- [ ] T030 [US1] Implement Session entity with invariants in src/server/domain/entities/Session.ts (depends on T028, T029)

#### Application Layer (Use Cases)

- [ ] T031 [P] [US1] Implement CreateSession use case in src/server/application/use-cases/session/CreateSession.ts
- [ ] T032 [P] [US1] Implement ValidateSession use case in src/server/application/use-cases/session/ValidateSession.ts
- [ ] T033 [P] [US1] Implement SetNickname use case in src/server/application/use-cases/session/SetNickname.ts

#### Infrastructure Layer (Repositories)

- [ ] T034 [US1] Implement CookieSessionRepository in src/server/infrastructure/repositories/CookieSessionRepository.ts

#### Presentation Layer (Server Actions and Components)

- [ ] T035 [P] [US1] Implement createSessionAction in src/app/actions/session.ts
- [ ] T036 [P] [US1] Implement setNicknameAction in src/app/actions/session.ts
- [ ] T037 [P] [US1] Implement validateSessionAction in src/app/actions/session.ts
- [ ] T038 [P] [US1] Implement UI Button component in src/components/ui/Button.tsx
- [ ] T039 [P] [US1] Implement UI Input component in src/components/ui/Input.tsx
- [ ] T040 [US1] Implement useNicknameForm custom hook in src/components/domain/session/hooks/useNicknameForm.ts
- [ ] T041 [US1] Implement NicknameInput Client Component in src/components/domain/session/NicknameInput.tsx (depends on T040)
- [ ] T042 [US1] Update TOP page (src/app/page.tsx) to show NicknameInput when no nickname exists

#### TDD: REFACTOR phase

- [ ] T043 [US1] Refactor session management code while keeping all tests green
- [ ] T044 [US1] Add edge case handling (empty nickname, cookie expiration, duplicate nicknames per Edge Cases section)
- [ ] T045 [US1] Verify all FR-001 through FR-005, FR-014, FR-015, FR-016 are satisfied
- [ ] T046 [US1] Verify SC-001 (30 second setup) and SC-002 (30 day persistence) are achieved

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Commit: "feat: implement session management with persistent cookies"

---

## Phase 4: User Story 2 - Browse Available Games (Priority: P2)

**Goal**: Users with established sessions can see which games are currently accepting participants, filtered by "出題中" status.

**Independent Test**: Create games with different statuses (準備中/出題中/締切), verify only games with 出題中 status appear on TOP page. Test with no games, test with many games.

**Dependencies**: Requires User Story 1 (session management) to be complete.

### Tests for User Story 2 (TDD: RED phase)

- [ ] T047 [P] [US2] Unit test for GameId value object validation in tests/unit/domain/GameId.test.ts
- [ ] T048 [P] [US2] Unit test for GameStatus value object validation in tests/unit/domain/GameStatus.test.ts
- [ ] T049 [P] [US2] Unit test for Game entity invariants in tests/unit/domain/Game.test.ts
- [ ] T050 [P] [US2] Unit test for GetAvailableGames use case in tests/unit/use-cases/GetAvailableGames.test.ts
- [ ] T051 [P] [US2] Integration test for InMemoryGameRepository in tests/integration/repositories/InMemoryGameRepository.test.ts
- [ ] T052 [US2] E2E test for game browsing flow in tests/e2e/top-page.spec.ts (browse games scenarios)

### Implementation for User Story 2 (TDD: GREEN phase)

#### Domain Layer

- [ ] T053 [P] [US2] Implement GameId value object with validation in src/server/domain/value-objects/GameId.ts
- [ ] T054 [P] [US2] Implement GameStatus value object with validation in src/server/domain/value-objects/GameStatus.ts
- [ ] T055 [US2] Implement Game entity with invariants in src/server/domain/entities/Game.ts (depends on T053, T054)

#### Application Layer

- [ ] T056 [US2] Implement GetAvailableGames use case in src/server/application/use-cases/games/GetAvailableGames.ts

#### Infrastructure Layer

- [ ] T057 [US2] Implement InMemoryGameRepository with singleton pattern in src/server/infrastructure/repositories/InMemoryGameRepository.ts

#### Presentation Layer

- [ ] T058 [P] [US2] Implement GameCard Server Component in src/components/domain/game/GameCard.tsx
- [ ] T059 [US2] Implement GameList Server Component in src/components/domain/game/GameList.tsx (depends on T058)
- [ ] T060 [US2] Update TOP page (src/app/page.tsx) to fetch and display game list when nickname exists
- [ ] T061 [US2] Add empty state message when no games available (per FR-011 equivalent)

#### TDD: REFACTOR phase

- [ ] T062 [US2] Refactor game filtering and display code while keeping tests green
- [ ] T063 [US2] Add edge case handling (no games, many games, JavaScript disabled scenario)
- [ ] T064 [US2] Verify FR-007, FR-008, FR-009, FR-010 are satisfied
- [ ] T065 [US2] Add basic Tailwind styling to GameList and GameCard components

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Commit: "feat: add game browsing with status filtering on TOP page"

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall quality

- [ ] T076 [P] Add responsive design improvements for mobile/tablet/desktop breakpoints
- [ ] T077 [P] Improve Tailwind styling consistency across all components
- [ ] T078 [P] Add Japanese language labels and messages per requirement spec
- [ ] T079 [P] Verify no-JavaScript functionality (FR-016) by disabling JS in browser DevTools
- [ ] T080 [P] Add comprehensive JSDoc comments to all public functions and components
- [ ] T081 [P] Verify all edge cases from spec are handled properly
- [ ] T082 Run full test suite and verify 100% of tests pass: npm run test:coverage
- [ ] T083 Run E2E tests and verify all user journeys pass: npm run test:e2e
- [ ] T084 Verify all functional requirements (FR-001 through FR-016) are satisfied
- [ ] T085 Verify all success criteria (SC-001, SC-002) are achieved
- [ ] T086 Run Biome linter and fix any issues: npm run check
- [ ] T087 Review quickstart.md validation checklist and confirm all items pass
- [ ] T088 [P] Update CLAUDE.md if any new patterns or conventions were established
- [ ] T089 Final commit: "chore: polish session management and TOP page feature"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - MVP baseline
- **User Story 2 (Phase 4)**: Depends on Foundational phase + User Story 1 completion
- **User Story 3 (Phase 5)**: Depends on Foundational phase + User Story 1 completion
- **User Story 4 (Phase 6)**: Depends on Foundational phase + User Story 1 completion
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: MVP foundation - Must complete first - No dependencies on other stories
- **User Story 2 (P2)**: Requires User Story 1 (needs session/nickname to display games) - Cannot be fully independent
- **User Story 3 (P3)**: Requires User Story 1 (needs nickname before showing navigation) - Light dependency
- **User Story 4 (P3)**: Requires User Story 1 (needs nickname before showing navigation) - Light dependency

**Note**: User Stories 3 and 4 could theoretically run in parallel after US1 is complete, as they're just adding navigation links.

### Within Each User Story (TDD Workflow)

1. **RED**: Write tests FIRST - verify they FAIL
2. **GREEN**: Implement minimum code to make tests pass
3. **REFACTOR**: Clean up code while keeping tests green

Within each phase:
- Tests before implementation (constitution mandate)
- Value objects before entities
- Entities before use cases
- Use cases before repositories/actions
- Models/logic before UI components
- Core functionality before edge cases
- Story verification before moving to next priority

### Parallel Opportunities

- **Setup (Phase 1)**: Tasks T002-T008 can all run in parallel (creating directories)
- **Foundational (Phase 2)**: Tasks T011, T012, T013, T014, T015, T017 can run in parallel
- **User Story 1 Tests**: Tasks T018-T026 can run in parallel (different test files)
- **User Story 1 Domain**: Tasks T028, T029 can run in parallel (different value objects)
- **User Story 1 Use Cases**: Tasks T031, T032, T033 can run in parallel (independent use cases)
- **User Story 1 Actions**: Tasks T035, T036, T037 can run in parallel (different actions)
- **User Story 1 UI**: Tasks T038, T039 can run in parallel (different UI components)
- **User Story 2 Tests**: Tasks T047-T051 can run in parallel (different test files)
- **User Story 2 Domain**: Tasks T053, T054 can run in parallel (different value objects)
- **User Story 2 UI**: Tasks T058, T067 (from US3) can run in parallel
- **Polish (Phase 7)**: Tasks T076-T081, T088 can run in parallel (different files/concerns)

---

## Parallel Example: User Story 1 (Session Management)

```bash
# RED phase: Launch all tests for User Story 1 together
Task: "Unit test for SessionId value object validation in tests/unit/domain/SessionId.test.ts"
Task: "Unit test for Nickname value object validation in tests/unit/domain/Nickname.test.ts"
Task: "Unit test for Session entity invariants in tests/unit/domain/Session.test.ts"
Task: "Unit test for CreateSession use case in tests/unit/use-cases/CreateSession.test.ts"
Task: "Unit test for ValidateSession use case in tests/unit/use-cases/ValidateSession.test.ts"
Task: "Unit test for SetNickname use case in tests/unit/use-cases/SetNickname.test.ts"
Task: "Unit test for useNicknameForm hook in tests/unit/hooks/useNicknameForm.test.ts"
Task: "Integration test for CookieSessionRepository in tests/integration/repositories/CookieSessionRepository.test.ts"
Task: "Integration test for session Server Actions in tests/integration/actions/session.test.ts"

# GREEN phase: Launch parallel implementations
Task: "Implement SessionId value object with validation in src/server/domain/value-objects/SessionId.ts"
Task: "Implement Nickname value object with validation in src/server/domain/value-objects/Nickname.ts"
# Wait for above to complete, then:
Task: "Implement CreateSession use case in src/server/application/use-cases/session/CreateSession.ts"
Task: "Implement ValidateSession use case in src/server/application/use-cases/session/ValidateSession.ts"
Task: "Implement SetNickname use case in src/server/application/use-cases/session/SetNickname.ts"
```

---

## Parallel Example: User Story 2 (Browse Games)

```bash
# RED phase: Launch all tests together
Task: "Unit test for GameId value object validation in tests/unit/domain/GameId.test.ts"
Task: "Unit test for GameStatus value object validation in tests/unit/domain/GameStatus.test.ts"
Task: "Unit test for Game entity invariants in tests/unit/domain/Game.test.ts"
Task: "Unit test for GetAvailableGames use case in tests/unit/use-cases/GetAvailableGames.test.ts"
Task: "Integration test for InMemoryGameRepository in tests/integration/repositories/InMemoryGameRepository.test.ts"

# GREEN phase: Launch parallel implementations
Task: "Implement GameId value object with validation in src/server/domain/value-objects/GameId.ts"
Task: "Implement GameStatus value object with validation in src/server/domain/value-objects/GameStatus.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T009) → Directory structure ready
2. Complete Phase 2: Foundational (T010-T017) → Core types and interfaces ready
3. Complete Phase 3: User Story 1 (T018-T046) → Session management fully functional
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Visit app, verify session created
   - Set nickname, verify saved in cookie
   - Close/reopen browser, verify session persists
   - Verify 30-day expiration set
5. Deploy/demo if ready - this is a functional MVP!

### Incremental Delivery

1. **Foundation** (Phases 1-2): Setup + Foundational → Ready for feature development
2. **MVP** (Phase 3): Add User Story 1 → Test independently → Deploy/Demo (Session management working!)
3. **Value Add 1** (Phase 4): Add User Story 2 → Test independently → Deploy/Demo (Game browsing working!)
4. **Value Add 2** (Phase 5): Add User Story 3 → Test independently → Deploy/Demo (Dashboard navigation!)
5. **Value Add 3** (Phase 6): Add User Story 4 → Test independently → Deploy/Demo (Game management navigation!)
6. **Production Ready** (Phase 7): Polish → Test suite passes → Ready for production

Each phase adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Phases 1-2)
2. Team completes User Story 1 together (Phase 3) - this is the MVP foundation
3. Once User Story 1 is done:
   - Developer A: User Story 2 (browse games)
   - Developer B: User Stories 3 + 4 (navigation links - can be done together)
4. Team reconvenes for Polish (Phase 7)

### TDD Workflow Per Task

For every implementation task:

1. **RED**: Write the test first, run it, verify it fails
2. **GREEN**: Write minimum code to make test pass
3. **REFACTOR**: Improve code quality while keeping tests green
4. **COMMIT**: Commit the working, tested code

Example for T028 (Implement SessionId):
```bash
# 1. RED: Write test first
# Create tests/unit/domain/SessionId.test.ts with failing tests
npm test tests/unit/domain/SessionId.test.ts  # Verify FAILS

# 2. GREEN: Implement to pass tests
# Create src/server/domain/value-objects/SessionId.ts
npm test tests/unit/domain/SessionId.test.ts  # Verify PASSES

# 3. REFACTOR: Clean up if needed
# Improve code quality
npm test  # Verify still passes

# 4. COMMIT
git add tests/unit/domain/SessionId.test.ts src/server/domain/value-objects/SessionId.ts
git commit -m "test: add SessionId value object with validation

- Add unit tests for SessionId validation
- Implement SessionId value object
- Enforce 21-character nanoid format
- Refs: FR-001 (session ID creation)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Notes

- **[P] tasks**: Different files, no dependencies, safe to run in parallel
- **[Story] label**: Maps task to specific user story for traceability and independent testing
- **TDD is mandatory**: Constitution Principle IV - write tests FIRST, then implement
- **Each user story should be independently completable and testable**: Verify at each checkpoint
- **Commit frequency**: After each task or logical group (per constitution Principle 0)
- **Stop at any checkpoint**: Validate story works independently before proceeding
- **File paths are exact**: Follow the paths specified in plan.md structure
- **Tests must fail first**: If a test passes before implementation, the test is wrong
- **Success criteria verification**: Each story should satisfy its acceptance scenarios

## Task Count Summary

- **Total Tasks**: 89
- **Phase 1 (Setup)**: 9 tasks
- **Phase 2 (Foundational)**: 8 tasks
- **Phase 3 (User Story 1)**: 29 tasks (10 tests + 15 implementation + 4 refactor)
- **Phase 4 (User Story 2)**: 19 tasks (6 tests + 9 implementation + 4 refactor)
- **Phase 5 (User Story 3)**: 5 tasks (1 test + 2 implementation + 2 refactor)
- **Phase 6 (User Story 4)**: 5 tasks (1 test + 1 implementation + 3 refactor)
- **Phase 7 (Polish)**: 14 tasks

**Parallel Opportunities**: 35 tasks marked [P] can run in parallel within their phase
**Independent Test Criteria**: Each user story has clear acceptance scenarios to verify independently
**Suggested MVP Scope**: Phases 1-3 (User Story 1 only) = 46 tasks for a functional MVP

## Success Criteria Verification

After implementation, verify:

- [ ] **SC-001**: New users can establish session and set nickname in < 30 seconds
- [ ] **SC-002**: Session cookies persist for 30+ days (test with browser restart)
- [ ] **FR-001**: Session ID in HTTP-only cookie
- [ ] **FR-002**: Nickname prompt shown to new users
- [ ] **FR-003**: Nickname stored in cookie
- [ ] **FR-004**: Cookies persist across browser sessions
- [ ] **FR-005**: Cookie expiration set to 30 days
- [ ] **FR-014**: Empty nickname validation works
- [ ] **FR-015**: Duplicate nicknames allowed
- [ ] **FR-016**: TOP page works without JavaScript (disable JS and test)

All tests pass + all functional requirements met + all success criteria achieved = Feature complete! 🎉
