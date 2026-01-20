-- Add new columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "group" text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS section text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS draft_data jsonb default '{}'::jsonb;

-- Add uniqueness constraint to student_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_student_id_key'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_student_id_key UNIQUE (student_id);
    END IF;
END $$;

-- Function to enforce immutability
CREATE OR REPLACE FUNCTION check_immutable_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Student ID
    IF OLD.student_id IS NOT NULL AND NEW.student_id IS DISTINCT FROM OLD.student_id THEN
        RAISE EXCEPTION 'Field student_id is immutable';
    END IF;

    -- Group
    IF OLD."group" IS NOT NULL AND NEW."group" IS DISTINCT FROM OLD."group" THEN
        RAISE EXCEPTION 'Field group is immutable';
    END IF;

    -- Section
    IF OLD.section IS NOT NULL AND NEW.section IS DISTINCT FROM OLD.section THEN
        RAISE EXCEPTION 'Field section is immutable';
    END IF;
    
    -- WhatsApp Number (using whatsapp_number column)
    IF OLD.whatsapp_number IS NOT NULL AND NEW.whatsapp_number IS DISTINCT FROM OLD.whatsapp_number THEN
        RAISE EXCEPTION 'Field whatsapp_number is immutable';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_check_immutable_fields ON public.profiles;

CREATE TRIGGER trigger_check_immutable_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION check_immutable_fields();
