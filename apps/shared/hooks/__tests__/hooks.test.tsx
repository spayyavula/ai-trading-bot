import { renderHook, act } from '@testing-library/react';
import {
  useClickOutside,
  useKeyboardShortcut,
  useLocalStorage,
  useApi,
  useDebounce,
  useInfiniteScroll,
  useForm,
  useMediaQuery,
} from '../index';
import { mockApiClient } from '../../test-utils/mocks/apiClient';
import { mockWebSocketClient } from '../../test-utils/mocks/websocketClient';

describe('useClickOutside', () => {
  it('calls handler when clicking outside', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickOutside(ref, handler));

    // Simulate click outside
    act(() => {
      document.body.click();
    });

    expect(handler).toHaveBeenCalled();
  });

  it('does not call handler when clicking inside', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickOutside(ref, handler));

    // Simulate click inside
    act(() => {
      ref.current.click();
    });

    expect(handler).not.toHaveBeenCalled();
  });
});

describe('useKeyboardShortcut', () => {
  it('calls handler when shortcut is pressed', () => {
    const handler = jest.fn();
    
    renderHook(() => useKeyboardShortcut('ctrl+s', handler));

    // Simulate keyboard shortcut
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(handler).toHaveBeenCalled();
  });

  it('does not call handler when different keys are pressed', () => {
    const handler = jest.fn();
    
    renderHook(() => useKeyboardShortcut('ctrl+s', handler));

    // Simulate different keyboard shortcut
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(handler).not.toHaveBeenCalled();
  });
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('updates value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('test')).toBe('"new value"');
  });
});

describe('useApi', () => {
  it('fetches data successfully', async () => {
    const { result } = renderHook(() => useApi(mockApiClient.getQuote, 'AAPL'));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBeDefined();
  });

  it('handles API errors', async () => {
    jest.spyOn(mockApiClient, 'getQuote').mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useApi(mockApiClient.getQuote, 'AAPL'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBe(null);
  });
});

describe('useDebounce', () => {
  it('debounces value updates', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    expect(result.current).toBe('updated');
  });
});

describe('useInfiniteScroll', () => {
  it('triggers callback when scrolling to bottom', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useInfiniteScroll(ref, callback));

    // Simulate scroll to bottom
    act(() => {
      Object.defineProperty(ref.current, 'scrollHeight', { value: 1000 });
      Object.defineProperty(ref.current, 'scrollTop', { value: 800 });
      Object.defineProperty(ref.current, 'clientHeight', { value: 200 });
      ref.current.dispatchEvent(new Event('scroll'));
    });

    expect(callback).toHaveBeenCalled();
  });
});

describe('useForm', () => {
  it('manages form state', () => {
    const { result } = renderHook(() => useForm({
      initialValues: { name: '', email: '' },
      onSubmit: jest.fn(),
    }));

    expect(result.current.values).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);

    act(() => {
      result.current.setFieldValue('name', 'John');
    });

    expect(result.current.values).toEqual({ name: 'John', email: '' });
  });

  it('validates form fields', () => {
    const { result } = renderHook(() => useForm({
      initialValues: { name: '', email: '' },
      validate: (values) => {
        const errors: Record<string, string> = {};
        if (!values.name) errors.name = 'Required';
        if (!values.email) errors.email = 'Required';
        return errors;
      },
      onSubmit: jest.fn(),
    }));

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({
      name: 'Required',
      email: 'Required',
    });
  });
});

describe('useMediaQuery', () => {
  it('returns true when media query matches', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(true);
  });

  it('returns false when media query does not match', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });
}); 