import {
  formatDate,
  formatNumber,
  formatCurrency,
  formatPercentage,
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  chunkArray,
  uniqueArray,
  shuffleArray,
  deepClone,
  pick,
  omit,
  capitalize,
  truncate,
  slugify,
  AppError,
  handleError,
  buildQueryString,
  parseQueryString,
} from '../index';

describe('Date Formatting Utilities', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-19T12:00:00Z');
    expect(formatDate(date)).toBe('Jan 19, 2024');
  });

  it('formats number correctly', () => {
    expect(formatNumber(1234.5678)).toBe('1,234.57');
    expect(formatNumber(1234.5678, 3)).toBe('1,234.568');
  });

  it('formats currency correctly', () => {
    expect(formatCurrency(1234.5678)).toBe('$1,234.57');
    expect(formatCurrency(1234.5678, 'EUR')).toBe('€1,234.57');
  });

  it('formats percentage correctly', () => {
    expect(formatPercentage(0.1234)).toBe('12.34%');
    expect(formatPercentage(0.1234, 1)).toBe('12.3%');
  });
});

describe('Validation Utilities', () => {
  it('validates email correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  it('validates password correctly', () => {
    expect(isValidPassword('Password123!')).toBe(true);
    expect(isValidPassword('weak')).toBe(false);
  });

  it('validates phone number correctly', () => {
    expect(isValidPhoneNumber('+1 (555) 123-4567')).toBe(true);
    expect(isValidPhoneNumber('invalid')).toBe(false);
  });
});

describe('Array Utilities', () => {
  it('chunks array correctly', () => {
    const array = [1, 2, 3, 4, 5, 6];
    expect(chunkArray(array, 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
  });

  it('creates unique array', () => {
    const array = [1, 2, 2, 3, 3, 3];
    expect(uniqueArray(array)).toEqual([1, 2, 3]);
  });

  it('shuffles array', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray([...array]);
    expect(shuffled).toHaveLength(array.length);
    expect(shuffled.sort()).toEqual(array.sort());
  });
});

describe('Object Utilities', () => {
  it('deep clones object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  it('picks specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('omits specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
  });
});

describe('String Utilities', () => {
  it('capitalizes string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
  });

  it('truncates string', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('slugifies string', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Test & Test')).toBe('test-test');
  });
});

describe('Error Handling', () => {
  it('creates AppError', () => {
    const error = new AppError('Test Error', 400);
    expect(error.message).toBe('Test Error');
    expect(error.status).toBe(400);
  });

  it('handles errors', () => {
    const error = new Error('Test Error');
    const handled = handleError(error);
    expect(handled).toBeDefined();
  });
});

describe('API Utilities', () => {
  it('builds query string', () => {
    const params = { a: 1, b: 'test', c: true };
    expect(buildQueryString(params)).toBe('a=1&b=test&c=true');
  });

  it('parses query string', () => {
    const query = 'a=1&b=test&c=true';
    expect(parseQueryString(query)).toEqual({
      a: '1',
      b: 'test',
      c: 'true',
    });
  });
}); 