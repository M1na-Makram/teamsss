-- Rename group column to avoid keyword collision
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'group'
    ) THEN
        ALTER TABLE public.profiles RENAME COLUMN "group" TO student_group;
    END IF;
END $$;

-- Ensure notification_settings table exists
CREATE TABLE IF NOT EXISTS public.notification_settings (
  user_id text primary key references profiles(firebase_uid) on delete cascade,
  team_requests boolean default true,
  admin_messages boolean default true,
  new_teams boolean default true,
  team_needs_members boolean default false,
  ratings boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Refine Trigger to use new column name
CREATE OR REPLACE FUNCTION check_immutable_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Student ID
    IF OLD.student_id IS NOT NULL AND NEW.student_id IS DISTINCT FROM OLD.student_id THEN
        RAISE EXCEPTION 'Field student_id is immutable';
    END IF;

    -- Student Group
    IF OLD.student_group IS NOT NULL AND NEW.student_group IS DISTINCT FROM OLD.student_group THEN
        RAISE EXCEPTION 'Field student_group is immutable';
    END IF;

    -- Section
    IF OLD.section IS NOT NULL AND NEW.section IS DISTINCT FROM OLD.section THEN
        RAISE EXCEPTION 'Field section is immutable';
    END IF;
    
    -- WhatsApp Number
    IF OLD.whatsapp_number IS NOT NULL AND NEW.whatsapp_number IS DISTINCT FROM OLD.whatsapp_number THEN
        RAISE EXCEPTION 'Field whatsapp_number is immutable';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
