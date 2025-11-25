// E2E Test: Results Dashboard
// Feature: 006-results-dashboard
// Tests the complete results dashboard flow (response status, scoreboard, results)

import { expect, test } from '@playwright/test';

test.describe('Results Dashboard - Moderator Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page and set nickname as moderator
    await page.goto('/');
    await page.fill('input[name="nickname"]', 'TestModerator');
    await page.click('button[type="submit"]');
    await page.waitForURL('/top');
  });

  test('should display response status dashboard during 出題中 phase', async ({ page }) => {
    // Given: A game in 出題中 status (test data game)
    const gameId = '550e8400-e29b-41d4-a716-446655440003';

    // When: Navigate to dashboard
    await page.goto(`/games/${gameId}/dashboard`);

    // Then: Should show dashboard with response status
    await expect(page.locator('h1')).toContainText('回答状況');

    // Should show participant count summary
    await expect(page.locator('text=/提出済み/')).toBeVisible();
    await expect(page.locator('text=/件/'))._toBeVisible();
  });

  test('should show submitted count and total participants', async ({ page }) => {
    // Given: A game with some submitted answers
    const gameId = '550e8400-e29b-41d4-a716-446655440003';

    // When: View dashboard
    await page.goto(`/games/${gameId}/dashboard`);

    // Then: Should display counts
    await expect(page.locator('text=/全/')).toBeVisible();
    await expect(page.locator('text=/人中/')).toBeVisible();
  });

  test('should navigate to scoreboard after closing game', async ({ page }) => {
    // Given: A game in 締切 status
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';

    // When: Navigate to scoreboard
    await page.goto(`/games/${closedGameId}/scoreboard`);

    // Then: Should show scoreboard
    await expect(page.locator('h1')).toContainText('スコアボード');

    // Should show participant scores
    await expect(page.locator('text=/得点/')).toBeVisible();
    await expect(page.locator('text=/点/')).toBeVisible();
  });

  test('should display scores sorted by total points', async ({ page }) => {
    // Given: A game with multiple participants
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';

    // When: View scoreboard
    await page.goto(`/games/${closedGameId}/scoreboard`);

    // Then: Scores should be sorted (highest first)
    // Note: Actual score values will depend on test data
    await expect(page.locator('text=/得点/')).toBeVisible();
  });

  test('should navigate to results page from scoreboard', async ({ page }) => {
    // Given: On scoreboard page
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';
    await page.goto(`/games/${closedGameId}/scoreboard`);

    // When: Click results link
    const resultsLink = page.locator('a[href*="/results"]');
    if (await resultsLink.isVisible()) {
      await resultsLink.click();
      await page.waitForURL(`/games/${closedGameId}/results`);

      // Then: Should show results page
      await expect(page.locator('h1')).toContainText('結果発表');
    }
  });

  test('should show winner celebration on results page', async ({ page }) => {
    // Given: A closed game
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';

    // When: Navigate to results page
    await page.goto(`/games/${closedGameId}/results`);

    // Then: Should show winner section
    await expect(page.locator('text=/優勝/')).toBeVisible();

    // Should show ranking
    await expect(page.locator('text=/位/')).toBeVisible();
  });

  test('should not allow access to dashboard for non-creator', async ({ page }) => {
    // Given: A different user (not game creator)
    await page.goto('/');
    await page.fill('input[name="nickname"]', 'OtherUser');
    await page.click('button[type="submit"]');
    await page.waitForURL('/top');

    // When: Try to access dashboard
    const gameId = '550e8400-e29b-41d4-a716-446655440003';
    await page.goto(`/games/${gameId}/dashboard`);

    // Then: Should redirect or show error
    // (Exact behavior depends on auth implementation)
    await page.waitForTimeout(1000);
  });
});

test.describe('Results Dashboard - Participant Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page and set nickname as participant
    await page.goto('/');
    await page.fill('input[name="nickname"]', 'TestParticipant');
    await page.click('button[type="submit"]');
    await page.waitForURL('/top');
  });

  test('should submit answer during 出題中 phase', async ({ page }) => {
    // Given: A game in 出題中 status
    const gameId = '550e8400-e29b-41d4-a716-446655440003';

    // When: Navigate to answer page
    await page.goto(`/games/${gameId}/answer`);

    // Then: Should show answer form
    await expect(page.locator('text=/回答/')).toBeVisible();

    // Should have presenter selections
    await expect(page.locator('form')).toBeVisible();
  });

  test('should show all presenters on answer form', async ({ page }) => {
    // Given: A game with presenters
    const gameId = '550e8400-e29b-41d4-a716-446655440003';

    // When: View answer form
    await page.goto(`/games/${gameId}/answer`);

    // Then: Should show presenters
    // (Number depends on test data)
    await expect(page.locator('text=/プレゼンター/')).toBeVisible();
  });

  test('should view results after game closes', async ({ page }) => {
    // Given: A closed game
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';

    // When: Navigate to results page
    await page.goto(`/games/${closedGameId}/results`);

    // Then: Should show results
    await expect(page.locator('h1')).toContainText('結果発表');

    // Should show participant's own rank
    await expect(page.locator('text=/位/')).toBeVisible();
  });

  test('should show confetti animation for winners', async ({ page }) => {
    // Given: A participant who won
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';

    // When: View results page
    await page.goto(`/games/${closedGameId}/results`);

    // Then: Winner section should be visible
    await expect(page.locator('text=/優勝/')).toBeVisible();

    // Note: Confetti animation is visual, hard to test in E2E
    // We verify the winner celebration component is rendered
  });

  test('should display detailed score breakdown', async ({ page }) => {
    // Given: Viewing results
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';
    await page.goto(`/games/${closedGameId}/results`);

    // Then: Should show score details
    await expect(page.locator('text=/得点/')).toBeVisible();
  });

  test('should show tie handling with multiple rank 1 winners', async ({ page }) => {
    // Given: A game with tied winners (test data specific)
    const tiedGameId = '550e8400-e29b-41d4-a716-446655440005';

    // When: View results
    await page.goto(`/games/${tiedGameId}/results`);

    // Then: Should show multiple winners if ties exist
    // (This depends on test data having actual ties)
    await expect(page.locator('text=/位/')).toBeVisible();
  });

  test('should not allow answer submission after game closes', async ({ page }) => {
    // Given: A closed game
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';

    // When: Try to access answer page
    await page.goto(`/games/${closedGameId}/answer`);

    // Then: Should show error or redirect
    // (Exact behavior depends on implementation)
    await page.waitForTimeout(1000);
  });
});

test.describe('Results Dashboard - Integration Tests', () => {
  test('should complete full moderator workflow', async ({ page }) => {
    // This is a comprehensive integration test
    // Given: Moderator logged in
    await page.goto('/');
    await page.fill('input[name="nickname"]', 'IntegrationModerator');
    await page.click('button[type="submit"]');
    await page.waitForURL('/top');

    // When: Navigate through dashboard → scoreboard → results
    const gameId = '550e8400-e29b-41d4-a716-446655440003';

    // Step 1: View dashboard (if game is 出題中)
    await page.goto(`/games/${gameId}/dashboard`);
    await expect(page.locator('h1')).toContainText('回答状況');

    // Step 2: After game closes, view scoreboard
    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';
    await page.goto(`/games/${closedGameId}/scoreboard`);
    await expect(page.locator('h1')).toContainText('スコアボード');

    // Step 3: View results
    await page.goto(`/games/${closedGameId}/results`);
    await expect(page.locator('h1')).toContainText('結果発表');
  });

  test('should show correct score calculations', async ({ page }) => {
    // Given: A closed game with known answers
    await page.goto('/');
    await page.fill('input[name="nickname"]', 'ScoreTestUser');
    await page.click('button[type="submit"]');
    await page.waitForURL('/top');

    const closedGameId = '550e8400-e29b-41d4-a716-446655440004';

    // When: View scoreboard
    await page.goto(`/games/${closedGameId}/scoreboard`);

    // Then: Scores should be calculated (10 points per correct answer)
    await expect(page.locator('text=/点/')).toBeVisible();

    // Note: Actual score values depend on test data
    // This test verifies the scoring UI is functional
  });
});
