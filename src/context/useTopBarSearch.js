import { createContext, useContext } from 'react';

export const TopBarSearchContext = createContext(null);

export function useTopBarSearch() {
    const context = useContext(TopBarSearchContext);
    if (!context) {
        throw new Error('useTopBarSearch must be used within TopBarSearchProvider');
    }
    return context;
}
