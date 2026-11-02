import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TopBarSearchContext } from './useTopBarSearch';

function getSearchConfig(pathname) {
    if (pathname.startsWith('/home')) {
        return {
            visible: true,
            placeholder: 'Search movies, members, users…',
        };
    }
    if (pathname.startsWith('/movies')) {
        return {
            visible: true,
            placeholder: 'Search movies by title, genre, or year…',
        };
    }
    return { visible: false, placeholder: '' };
}

export function TopBarSearchProvider({ children }) {
    const { pathname } = useLocation();
    const [search, setSearch] = useState('');
    const config = useMemo(() => getSearchConfig(pathname), [pathname]);

    useEffect(() => {
        setSearch('');
    }, [pathname]);

    const value = useMemo(
        () => ({
            search,
            setSearch,
            searchVisible: config.visible,
            placeholder: config.placeholder,
        }),
        [search, config.visible, config.placeholder]
    );

    return (
        <TopBarSearchContext.Provider value={value}>
            {children}
        </TopBarSearchContext.Provider>
    );
}
