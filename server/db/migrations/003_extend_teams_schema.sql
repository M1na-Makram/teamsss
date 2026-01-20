-- 1. Extend Teams Table
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS faculty text,
ADD COLUMN IF NOT EXISTS term text,
ADD COLUMN IF NOT EXISTS max_members integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS section text,
ADD COLUMN IF NOT EXISTS student_group text;

-- 2. Update Team Members Status Check
-- Ensure 'invited' is a valid status. If constraint exists, drop and re-add.
DO $$
BEGIN
    -- Check if there's a check constraint on status
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'team_members_status_check') THEN
        ALTER TABLE public.team_members DROP CONSTRAINT team_members_status_check;
    END IF;
    
    -- Re-add constraint with 'invited'
    ALTER TABLE public.team_members 
    ADD CONSTRAINT team_members_status_check 
    CHECK (status IN ('pending', 'accepted', 'rejected', 'invited', 'owner'));
END $$;

-- 3. RLS Policy Updates (Refining)

-- Ensure members can view their own teams (invited or otherwise)
DROP POLICY IF EXISTS "Users can view team memberships" ON public.team_members;
CREATE POLICY "Users can view team memberships"
    ON public.team_members FOR SELECT
    USING ( (auth.jwt() ->> 'sub') = user_id );

-- Users can view teams they are invited to or member of (complex, often public read is easier for teams)
-- But strict requirement: "Members can only view their own team"? 
-- Usually Browse Teams page shows ALL teams in the course. 
-- "137: Browse & Manage Academic Teams" -> implies public read for Teams table is fine or scoped to Course.
-- Let's keep Teams table readable by authenticated users (existing policy usually "Enable read access for all users").
-- If strict viewing is needed:
-- DROP POLICY IF EXISTS "Public teams are viewable by everyone" ON public.teams;
-- CREATE POLICY "Public teams are viewable by everyone" ON public.teams FOR SELECT USING (true); -- Keep public for browsing

-- 4. Triggers / Functions (Optional but good for consistency)
-- Trigger to fail insert if max_members exceeded? 
-- Doing it in backend controller is easier for providing "Join Request Sent" vs "Team Full" feedback.
