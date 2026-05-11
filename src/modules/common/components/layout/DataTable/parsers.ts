import { z } from 'zod';

import type { ExtendedColumnSort } from './types';

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

/**
 * Parse sorting state from string (JSON)
 */
export const parseSortingState = <TData>(
  value: unknown,
  columnIds?: string[] | Set<string>
): ExtendedColumnSort<TData>[] => {
  if (typeof value !== 'string') return [];

  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  try {
    const parsed = JSON.parse(value);
    const result = z.array(sortingItemSchema).safeParse(parsed);

    if (!result.success) return [];

    if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
      return [];
    }

    return result.data as ExtendedColumnSort<TData>[];
  } catch {
    return [];
  }
};

/**
 * Serialize sorting state to string (JSON)
 */
export const serializeSortingState = <TData>(
  value: ExtendedColumnSort<TData>[]
): string => {
  return JSON.stringify(value);
};

/**
 * Parse filter value from search params
 */
export const parseFilterValue = (
  value: unknown,
  hasOptions: boolean
): string | string[] | null => {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    if (hasOptions) {
      return value.split(',').filter(Boolean);
    }
    return value;
  }

  if (Array.isArray(value) && hasOptions) {
    return value.filter((item) => typeof item === 'string');
  }

  return null;
};

/**
 * Serialize filter value for search params
 */
export const serializeFilterValue = (
  value: string | string[] | null
): string | undefined => {
  if (value === null || value === undefined) return undefined;

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : undefined;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }

  return undefined;
};
