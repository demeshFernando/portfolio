export function sort<T, K extends keyof T>(arr: T[], key: K, order: 'asc' | 'desc' = 'asc') {
    return arr.sort((a, b) => compareValues(a[key], b[key], order));
}

function compareValues<V>(a: V, b: V, order: 'asc' | 'desc'): number {
    const an = a == null;
    const bn = b == null;
    if(an && bn) return 0;

    if(an) return order === 'asc' ? 1 : -1;
    if(bn) return order === 'asc' ? -1 : 1;

    if(typeof a === 'number' && typeof b === 'number') {
        return order === 'asc' ? a - b : b - a;
    }
    if(a instanceof Date && b instanceof Date) {
        const diff = a.getTime() - b.getTime();
        return order === 'asc' ? diff : -diff;
    }
    if(typeof a === 'string' && typeof b === 'string') {
        const cmp = a.localeCompare(b);
        return order === 'asc' ? cmp : -cmp;
    }

    const sa = String(a);
    const sb = String(b);
    const cmp = sa.localeCompare(sb);
    return order === 'asc' ? cmp : -cmp;
}