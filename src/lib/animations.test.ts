/**
 * Animation Utilities Tests
 * Tests for animation helpers and sequences
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  animationSequences,
  animations,
  animationUtils,
  customAnimations,
  generateConfettiParticles,
} from './animations';

describe('animations', () => {
  it('should export success animations', () => {
    expect(animations.success).toBeDefined();
    expect(animations.success.button).toContain('bg-green-600');
    expect(animations.success.icon).toContain('text-green-600');
  });

  it('should export error animations', () => {
    expect(animations.error).toBeDefined();
    expect(animations.error.button).toContain('bg-red-600');
    expect(animations.error.icon).toContain('text-red-600');
  });

  it('should export loading animations', () => {
    expect(animations.loading).toBeDefined();
    expect(animations.loading.spinner).toContain('animate-spin');
    expect(animations.loading.pulse).toContain('animate-pulse');
  });

  it('should export status transition animations', () => {
    expect(animations.statusTransition).toBeDefined();
    expect(animations.statusTransition.fadeIn).toContain('opacity-100');
    expect(animations.statusTransition.fadeOut).toContain('opacity-0');
  });

  it('should export toast animations', () => {
    expect(animations.toast).toBeDefined();
    expect(animations.toast.slideIn).toBe('animate-slide-in-right');
    expect(animations.toast.fadeIn).toBe('animate-fade-in');
  });
});

describe('customAnimations', () => {
  it('should export keyframe definitions', () => {
    expect(customAnimations).toBeDefined();
    expect(customAnimations['@keyframes bounce-in']).toBeDefined();
    expect(customAnimations['@keyframes shake']).toBeDefined();
    expect(customAnimations['@keyframes slide-in-right']).toBeDefined();
    expect(customAnimations['@keyframes fade-in']).toBeDefined();
  });
});

describe('animationUtils', () => {
  let mockElement: HTMLElement;
  let addSpy: ReturnType<typeof vi.fn>;
  let removeSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    addSpy = vi.fn();
    removeSpy = vi.fn();
    mockElement = {
      classList: {
        add: addSpy,
        remove: removeSpy,
      },
    } as unknown as HTMLElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('addTemporaryClass', () => {
    it('should add class and remove it after default duration', async () => {
      const promise = animationUtils.addTemporaryClass(mockElement, 'test-class');

      expect(addSpy).toHaveBeenCalledWith('test-class');
      expect(removeSpy).not.toHaveBeenCalled();

      // Fast-forward time
      vi.advanceTimersByTime(1000);
      await promise;

      expect(removeSpy).toHaveBeenCalledWith('test-class');
    });

    it('should add class and remove it after custom duration', async () => {
      const promise = animationUtils.addTemporaryClass(mockElement, 'test-class', 500);

      expect(addSpy).toHaveBeenCalledWith('test-class');

      vi.advanceTimersByTime(500);
      await promise;

      expect(removeSpy).toHaveBeenCalledWith('test-class');
    });

    it('should resolve promise after duration', async () => {
      const promise = animationUtils.addTemporaryClass(mockElement, 'test-class', 200);

      vi.advanceTimersByTime(200);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('playSuccessFeedback', () => {
    it('should play success animation sequence', async () => {
      const promise = animationUtils.playSuccessFeedback(mockElement);

      // First animation: bounce-in for 600ms
      expect(addSpy).toHaveBeenCalledWith('animate-bounce-in');

      vi.advanceTimersByTime(600);
      await vi.runAllTimersAsync();

      expect(removeSpy).toHaveBeenCalledWith('animate-bounce-in');
      expect(addSpy).toHaveBeenCalledWith(animations.statusTransition.highlight);

      vi.advanceTimersByTime(2000);
      await promise;

      expect(removeSpy).toHaveBeenCalledWith(animations.statusTransition.highlight);
    });
  });

  describe('playErrorFeedback', () => {
    it('should play error animation sequence', async () => {
      const promise = animationUtils.playErrorFeedback(mockElement);

      expect(addSpy).toHaveBeenCalledWith('animate-shake');

      vi.advanceTimersByTime(600);
      await promise;

      expect(removeSpy).toHaveBeenCalledWith('animate-shake');
    });
  });

  describe('transitionStatusBadge', () => {
    it('should transition badge with fade out and fade in', async () => {
      const promise = animationUtils.transitionStatusBadge(mockElement);

      // Fade out
      expect(addSpy).toHaveBeenCalledWith(animations.statusTransition.fadeOut);

      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();

      // Fade in
      expect(removeSpy).toHaveBeenCalledWith(animations.statusTransition.fadeOut);
      expect(addSpy).toHaveBeenCalledWith(animations.statusTransition.fadeIn);

      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();

      // Highlight
      expect(addSpy).toHaveBeenCalledWith(animations.statusTransition.highlight);

      vi.advanceTimersByTime(2000);
      await promise;

      expect(removeSpy).toHaveBeenCalledWith(animations.statusTransition.highlight);
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return true when user prefers reduced motion', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      const result = animationUtils.prefersReducedMotion();

      expect(result).toBe(true);
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should return false when user does not prefer reduced motion', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      const result = animationUtils.prefersReducedMotion();

      expect(result).toBe(false);
    });
  });

  describe('conditionalAnimation', () => {
    it('should apply animation when motion is not reduced', async () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      const promise = animationUtils.conditionalAnimation(mockElement, 'test-class', 500);

      expect(addSpy).toHaveBeenCalledWith('test-class');

      vi.advanceTimersByTime(500);
      await promise;

      expect(removeSpy).toHaveBeenCalledWith('test-class');
    });

    it('should skip animation when motion is reduced', async () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      await animationUtils.conditionalAnimation(mockElement, 'test-class', 500);

      expect(addSpy).not.toHaveBeenCalled();
      expect(removeSpy).not.toHaveBeenCalled();
    });
  });
});

describe('animationSequences', () => {
  let mockElement: HTMLElement;
  let addSpy: ReturnType<typeof vi.fn>;
  let removeSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    addSpy = vi.fn();
    removeSpy = vi.fn();
    mockElement = {
      classList: {
        add: addSpy,
        remove: removeSpy,
      },
    } as unknown as HTMLElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('buttonSuccess', () => {
    it('should apply success animation when motion is not reduced', async () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      const promise = animationSequences.buttonSuccess(mockElement);

      expect(addSpy).toHaveBeenCalledWith('scale-105 bg-green-600');

      vi.advanceTimersByTime(800);
      await promise;

      expect(removeSpy).toHaveBeenCalledWith('scale-105 bg-green-600');
    });

    it('should skip animation when motion is reduced', async () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      await animationSequences.buttonSuccess(mockElement);

      expect(addSpy).not.toHaveBeenCalled();
    });
  });

  describe('buttonError', () => {
    it('should apply error animation when motion is not reduced', async () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      const promise = animationSequences.buttonError(mockElement);

      expect(addSpy).toHaveBeenCalledWith('animate-shake');

      vi.advanceTimersByTime(600);
      await promise;

      expect(removeSpy).toHaveBeenCalledWith('animate-shake');
    });
  });

  describe('statusBadgeUpdate', () => {
    it('should transition badge and call onContentUpdate', async () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      const onContentUpdate = vi.fn();

      const promise = animationSequences.statusBadgeUpdate(mockElement, onContentUpdate);

      // Fade out
      expect(addSpy).toHaveBeenCalledWith(animations.statusTransition.fadeOut);

      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();

      // Content update
      expect(onContentUpdate).toHaveBeenCalledTimes(1);

      // Fade in
      expect(removeSpy).toHaveBeenCalledWith(animations.statusTransition.fadeOut);
      expect(addSpy).toHaveBeenCalledWith(animations.statusTransition.fadeIn);

      vi.advanceTimersByTime(2300);
      await promise;
    });

    it('should skip animation and call onContentUpdate immediately when motion is reduced', async () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      vi.stubGlobal('window', { matchMedia: mockMatchMedia });

      const onContentUpdate = vi.fn();

      await animationSequences.statusBadgeUpdate(mockElement, onContentUpdate);

      expect(onContentUpdate).toHaveBeenCalledTimes(1);
      expect(addSpy).not.toHaveBeenCalled();
    });
  });
});

describe('generateConfettiParticles', () => {
  it('should generate specified number of particles', () => {
    const particles = generateConfettiParticles(10);

    expect(particles).toHaveLength(10);
  });

  it('should generate particles with required properties', () => {
    const particles = generateConfettiParticles(5);

    for (const particle of particles) {
      expect(particle).toHaveProperty('x');
      expect(particle).toHaveProperty('y');
      expect(particle).toHaveProperty('rotation');
      expect(particle).toHaveProperty('scale');
      expect(particle).toHaveProperty('color');
      expect(particle).toHaveProperty('velocity');
      expect(particle.velocity).toHaveProperty('x');
      expect(particle.velocity).toHaveProperty('y');
    }
  });

  it('should generate particles with valid ranges', () => {
    const particles = generateConfettiParticles(20);

    for (const particle of particles) {
      expect(particle.x).toBeGreaterThanOrEqual(0);
      expect(particle.x).toBeLessThanOrEqual(100);
      expect(particle.y).toBe(-10);
      expect(particle.rotation).toBeGreaterThanOrEqual(0);
      expect(particle.rotation).toBeLessThanOrEqual(360);
      expect(particle.scale).toBeGreaterThanOrEqual(0.5);
      expect(particle.scale).toBeLessThanOrEqual(1);
      expect(particle.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('should generate particles with varied colors', () => {
    const particles = generateConfettiParticles(50);
    const colors = new Set(particles.map((p) => p.color));

    // With 50 particles and 7 colors, we should have variety
    expect(colors.size).toBeGreaterThan(1);
  });

  it('should generate empty array for zero count', () => {
    const particles = generateConfettiParticles(0);

    expect(particles).toHaveLength(0);
  });
});
