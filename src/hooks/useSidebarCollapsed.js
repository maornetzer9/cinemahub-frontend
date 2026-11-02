import { useCallback, useState } from 'react';

const STORAGE_KEY = 'cinemaHub_sidebarCollapsed';

function readStoredCollapsed() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'false') === true;
    } catch {
        return false;
    }
}

export function useSidebarCollapsed() {
    const [collapsed, setCollapsed] = useState(readStoredCollapsed);

    const toggleCollapsed = useCallback(() => {
        setCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return { collapsed, toggleCollapsed };
}
