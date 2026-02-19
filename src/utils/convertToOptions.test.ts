import { describe, expect, it } from 'vitest';
import { convertToOptions } from './convertToOptions';

describe('convertToOptions', () => {
    it('converts an array of objects to select options', () => {
        const data = [
            { id: '1', name: 'Option A' },
            { id: '2', name: 'Option B' },
        ];
        const result = convertToOptions(data, 'name', 'id');
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ key: '1', label: 'Option A', value: '1' });
        expect(result[1]).toEqual({ key: '2', label: 'Option B', value: '2' });
    });

    it('returns an empty array for empty input', () => {
        const result = convertToOptions([], 'name', 'id');
        expect(result).toEqual([]);
    });

    it('filters out entries with null or undefined values when filterEmptyValues is true', () => {
        const data = [
            { id: '1', name: 'Option A' },
            { id: null, name: 'Option B' },
            { id: undefined, name: 'Option C' },
        ];
        const result = convertToOptions(data as any, 'name', 'id', true);
        expect(result).toHaveLength(1);
        expect(result[0].value).toBe('1');
    });
});
