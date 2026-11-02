/** Client-side topbar search matchers — UI only */

export function normalizeSearchQuery(query) {
    return String(query ?? '').trim().toLowerCase();
}

export function movieMatchesSearch(movie, query) {
    const q = normalizeSearchQuery(query);
    if (!q) return true;

    const name = String(movie?.name ?? '').toLowerCase();
    const premiered = String(movie?.premiered ?? '');
    const year = premiered ? String(new Date(premiered).getFullYear()) : '';
    const genres = (movie?.genres ?? []).map((g) => String(g).toLowerCase());

    return (
        name.includes(q) ||
        premiered.toLowerCase().includes(q) ||
        (year && year.includes(q)) ||
        genres.some((genre) => genre.includes(q))
    );
}

export function memberMatchesSearch(member, query) {
    const q = normalizeSearchQuery(query);
    if (!q) return true;

    const name = String(member?.name ?? '').toLowerCase();
    const email = String(member?.email ?? '').toLowerCase();
    const city = String(member?.city ?? '').toLowerCase();

    return name.includes(q) || email.includes(q) || city.includes(q);
}

export function userMatchesSearch(user, query) {
    const q = normalizeSearchQuery(query);
    if (!q) return true;

    const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim().toLowerCase();
    const username = String(user?.username ?? '').toLowerCase();
    const createAt = String(user?.createAt ?? '').toLowerCase();

    return fullName.includes(q) || username.includes(q) || createAt.includes(q);
}
