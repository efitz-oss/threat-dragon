/**
 * Minimal test file to validate Vitest configuration
 */
import { describe, it, expect } from 'vitest';

describe('Minimal test', () => {
    it('should pass a simple test', () => {
        expect(true).toBe(true);
    });

    it('should handle basic math', () => {
        expect(1 + 1).toBe(2);
    });
});
