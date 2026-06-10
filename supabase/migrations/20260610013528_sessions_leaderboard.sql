DO $$ BEGIN
    CREATE TYPE "public"."book_genre" AS ENUM (
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
    'classic'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "public"."user_book" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    author VARCHAR(255),
    number_of_pages INTEGER,
    genre public.book_genre,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."reading_session" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.user_book(id) ON DELETE CASCADE,
    pages_read INTEGER NOT NULL,
    minutes_read INTEGER NOT NULL,
    session_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE "public"."reading_session" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_book" ENABLE ROW LEVEL SECURITY;

-- RLS policies: user_book
CREATE POLICY "Users can view their own books"
    ON public.user_book FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books"
    ON public.user_book FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
    ON public.user_book FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
    ON public.user_book FOR DELETE
    USING (auth.uid() = user_id);

-- RLS policies: reading_session
CREATE POLICY "Users can view their own sessions"
    ON public.reading_session FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
    ON public.reading_session FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
    ON public.reading_session FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
    ON public.reading_session FOR DELETE
    USING (auth.uid() = user_id);

CREATE OR REPLACE VIEW "public"."leaderboard_view" AS
SELECT
  rs.user_id,
  u.email,
  SUM(pages_read) as total_pages,
  SUM(minutes_read) as total_minutes,
  COUNT(*) as total_sessions,
  AVG(pages_read) as avg_pages_per_session,
  AVG(minutes_read) as avg_minutes_per_session,
  MAX(session_date) as last_session_date
FROM reading_session rs
JOIN auth.users u ON rs.user_id = u.id
GROUP BY rs.user_id, u.email;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.reading_session;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.reading_session
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.user_book;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.user_book
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();