import { useEffect, useState } from 'react';
class StateService {
  private memoryState: Map<string, any> = new Map();
  private listeners: Map<string, Set<(value: any) => void>> = new Map();
  set<T>(key: string, value: T): void {
    this.memoryState.set(key, value);
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.forEach((listener) => listener(value));
    }
  }
  get<T>(key: string): T | null {
    return (this.memoryState.get(key) as T) || null;
  }
  remove(key: string): void {
    this.memoryState.delete(key);
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.forEach((listener) => listener(null));
    }
  }
  subscribe<T>(key: string, callback: (value: T | null) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(callback);
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
      }
    };
  }
  clearAll(): void {
    this.memoryState.clear();
    this.listeners.forEach((listeners, key) => {
      listeners.forEach((listener) => listener(null));
    });
  }
}
export const stateService = new StateService();
export function useSharedState<T>(
  key: string,
  initialValue?: T,
): [T | null, (value: T | null) => void] {
  const [state, setState] = useState<T | null>(() => {
    const existing = stateService.get<T>(key);
    return existing !== null ? existing : initialValue || null;
  });
  useEffect(() => {
    if (initialValue !== undefined && stateService.get(key) === null) {
      stateService.set(key, initialValue);
    }
    const unsubscribe = stateService.subscribe<T>(key, (value) => {
      setState(value);
    });
    return () => {
      unsubscribe();
    };
  }, [key, initialValue]);
  const updateState = (value: T | null) => {
    if (value === null) {
      stateService.remove(key);
    } else {
      stateService.set(key, value);
    }
    setState(value);
  };
  return [state, updateState];
}
