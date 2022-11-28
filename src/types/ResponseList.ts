export interface HalResponseList<T> {
    _embedded: Array<{ _embedded: T }>;
    total: number;
}

export interface ResponseList<T> {
    data: T[];
    total: number;
}
