// Mirrors the public.user_book table / public.book_genre enum defined in
// supabase/migrations/20260610013528_sessions_leaderboard.sql
export const BOOK_GENRES = [
    'fiction',
    'non_fiction',
    'mystery',
    'thriller',
    'romance',
    'science_fiction',
    'fantasy',
    'horror',
    'historical_fiction',
    'biography',
    'autobiography',
    'memoir',
    'self_help',
    'psychology',
    'philosophy',
    'science',
    'technology',
    'history',
    'politics',
    'economics',
    'business',
    'true_crime',
    'travel',
    'cooking',
    'art',
    'poetry',
    'graphic_novel',
    'young_adult',
    'childrens',
    'classic',
] as const

export type BookGenre = (typeof BOOK_GENRES)[number]

export interface UserBook {
    id: string
    user_id: string
    title: string | null
    author: string | null
    number_of_pages: number | null
    genre: BookGenre | null
    thumbnail_url: string | null
    created_at: string
    updated_at: string
}

// Turn an enum value like "science_fiction" into "Science Fiction" for display.
export function formatGenre(genre: string): string {
    return genre
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
