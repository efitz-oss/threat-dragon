# Jest to Vitest Migration Guide

This document outlines the changes needed to migrate tests from Jest to Vitest in the Threat Dragon project.

## Key Differences

Vitest is largely API-compatible with Jest, but there are some differences to be aware of:

### Imports

```javascript
// Before (Jest)
// No imports needed, jest globals available

// After (Vitest)
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
```

### Mocking

```javascript
// Before (Jest)
jest.mock('./myModule');
const spy = jest.spyOn(object, 'method');
const mockFn = jest.fn();

// After (Vitest)
import { vi } from 'vitest';
vi.mock('./myModule');
const spy = vi.spyOn(object, 'method');
const mockFn = vi.fn();
```

### Timers

```javascript
// Before (Jest)
jest.useFakeTimers();
jest.advanceTimersByTime(1000);
jest.useRealTimers();

// After (Vitest)
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

### Snapshot Testing

Snapshot testing works the same way, but snapshot files have a slightly different format.

```javascript
// Before and after (same API)
expect(component.html()).toMatchSnapshot();
```

## Setup Files

Vitest uses a slightly different approach to setup files. In this project:

1. Global setup is in `tests/unit/setup/index.js`
2. Custom matchers are in `tests/matchers/custom.js`

## Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Common Issues and Solutions

### Module mocking with ES modules

With ES modules, you may need to use dynamic imports for mocking:

```javascript
vi.mock('./myModule', async () => {
  const actual = await vi.importActual('./myModule');
  return {
    ...actual,
    someFunction: vi.fn()
  };
});
```

### DOM Testing

Vitest uses JSDOM (or optionally happy-dom) for DOM testing. If you need to test DOM behavior:

```javascript
import { screen, fireEvent } from '@testing-library/dom';

// Use screen.getByText and other queries
const element = screen.getByText('Click me');
await fireEvent.click(element);
```

### Custom Matchers

Custom Jest matchers have been ported to Vitest. Use them the same way:

```javascript
expect(wrapper).toHaveClass('active');
expect(wrapper).toContainText('Hello');
expect(wrapper).toHaveEmitted('click');
```

## Migration Checklist

- [ ] Update imports to include Vitest functions
- [ ] Change all Jest API calls to Vitest (jest → vi)
- [ ] Update mocks to use ES module patterns if needed
- [ ] Run tests and fix any compatibility issues
- [ ] Verify snapshots are working correctly
- [ ] Update any CI/CD scripts to use Vitest commands