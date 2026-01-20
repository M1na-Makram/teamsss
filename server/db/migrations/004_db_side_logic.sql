-- 1. Function to validate team membership rules
CREATE OR REPLACE FUNCTION public.check_team_membership_rules()
RETURNS TRIGGER AS $$
DECLARE
    user_courses text[];
    team_course_code text;
    existing_team_count int;
BEGIN
    -- A. Fetch user's enrolled courses
    SELECT courses INTO user_courses FROM public.profiles WHERE firebase_uid = NEW.user_id;
    
    -- B. Fetch the course code of the team being joined/created
    SELECT course INTO team_course_code FROM public.teams WHERE id = NEW.team_id;
    
    -- C. ENROLLMENT CHECK: Must be enrolled in the course
    IF NOT (team_course_code = ANY(user_courses)) THEN
        RAISE EXCEPTION 'You are not enrolled in the course %', team_course_code;
    END IF;

    -- D. ONE TEAM PER COURSE CHECK (for 'accepted' or 'owner' status)
    -- We check if the user is already in another team for the SAME course
    SELECT COUNT(*) INTO existing_team_count
    FROM public.team_members tm
    JOIN public.teams t ON tm.team_id = t.id
    WHERE tm.user_id = NEW.user_id 
      AND t.course = team_course_code
      AND tm.status IN ('accepted', 'owner')
      AND tm.team_id != NEW.team_id;

    IF existing_team_count > 0 THEN
        RAISE EXCEPTION 'You already belong to a team for course %', team_course_code;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger for team membership
DROP TRIGGER IF EXISTS team_membership_rules_trigger ON public.team_members;
CREATE TRIGGER team_membership_rules_trigger
BEFORE INSERT OR UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.check_team_membership_rules();


-- 3. Function to handle invitations by Student ID (Simplified for Frontend)
-- This allows the frontend to call a RPC to invite someone without knowing their user_id
CREATE OR REPLACE FUNCTION public.invite_by_student_id(p_team_id uuid, p_student_id text)
RETURNS void AS $$
DECLARE
    v_invitee_uid uuid;
BEGIN
    SELECT firebase_uid INTO v_invitee_uid FROM public.profiles WHERE student_id = p_student_id;
    
    IF v_invitee_uid IS NULL THEN
        RAISE EXCEPTION 'Student ID % not found', p_student_id;
    END IF;

    INSERT INTO public.team_members (team_id, user_id, status, role)
    VALUES (p_team_id, v_invitee_uid, 'invited', 'member');
END;
$$ LANGUAGE plpgsql;
