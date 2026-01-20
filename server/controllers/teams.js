const { sendNotification } = require('../services/notificationService');
const { adminSupabase } = require('../db/supabaseClient');

const getTeams = async (req, res) => {
  const db = req.db;
  const { uid } = req.user;
  const { course, faculty, term, search } = req.query;

  try {
    let query = db.from('teams').select(`
      *,
      members:team_members(count),
      my_membership:team_members(status)
    `).neq('status', 'archived');

    if (course && course !== 'All Courses') query = query.eq('course', course);
    if (faculty && faculty !== 'All Faculties') query = query.eq('faculty', faculty);
    if (term && term !== 'All Terms') query = query.eq('term', term);

    const { data: teams, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const processedTeams = await Promise.all(teams.map(async (t) => {
        // Precise count of accepted members
        const { count } = await db.from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', t.id)
            .eq('status', 'accepted');
        
        // Count invites as well? No, usually valid members = accepted
        
        const { data: myMem } = await db.from('team_members')
            .select('status')
            .eq('team_id', t.id)
            .eq('user_id', uid)
            .single();

        return {
            ...t,
            memberCount: count,
            userStatus: myMem?.status || null,
        };
    }));

    let results = processedTeams;
    if (search) {
       const lower = search.toLowerCase();
       results = results.filter(t => t.name.toLowerCase().includes(lower));
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createTeam = async (req, res) => {
  const db = req.db;
  const { uid } = req.user;
  const { name, courseCode, faculty, term, maxMembers, description, invitedStudents } = req.body;
  // invitedStudents: array of student IDs (e.g. ['2023001', '2023002'])

  try {
     // 1. Fetch User Profile for Validation
     const { data: profile } = await db.from('profiles')
        .select('courses, student_group, section')
        .eq('firebase_uid', uid)
        .single();
     
     // 2. Enrollment Check
     if (!profile?.courses?.includes(courseCode)) {
         return res.status(403).json({ message: 'You must be enrolled in this course to create a team.' });
     }

     // 3. One Team Per Course Check
     // Check if user is already an 'accepted' member (or owner) of a team in this course
     const { data: myTeams } = await db.from('team_members')
        .select('team_id, teams(course)')
        .eq('user_id', uid)
        .eq('status', 'accepted'); // Owner is also 'accepted' status usually, or check both

     const alreadyInTeam = myTeams?.some(m => m.teams?.course === courseCode);
     if (alreadyInTeam) {
        return res.status(409).json({ message: 'You already belong to a team for this course.' });
     }

     // 4. Create Team
     const { data: newTeam, error: createError } = await db.from('teams').insert({
        name,
        course: courseCode, 
        faculty,
        term,
        max_members: maxMembers,
        description,
        created_by: uid,
        section: profile.section, // Inherit from leader
        student_group: profile.student_group // Inherit from leader
     }).select().single();

     if (createError) throw createError;

     // 5. Add Leader
     await db.from('team_members').insert({
        team_id: newTeam.id,
        user_id: uid,
        role: 'owner',
        status: 'accepted'
     });

     // 6. Handle Invites (if any)
     if (invitedStudents && invitedStudents.length > 0) {
        // Loop through Student IDs
        for (const studentId of invitedStudents) {
            // Find user by Student ID
            // Using adminSupabase to find users by student_id (bypassing RLS for search)
            const { data: invitee } = await adminSupabase
                .from('profiles')
                .select('firebase_uid, fcm_token')
                .eq('student_id', studentId)
                .single();
            
            if (invitee) {
                // Check if they are already in a team? 
                // Ideally yes, but maybe soft check. We insert 'invited'.
                
                await db.from('team_members').insert({
                    team_id: newTeam.id,
                    user_id: invitee.firebase_uid,
                    status: 'invited',
                    role: 'member'
                });
                
                // Notify Invitee
                await sendNotification(
                    invitee.firebase_uid,
                    'team_invite',
                    'Team Invitation',
                    `You have been invited to join team "${name}" for ${courseCode}.`
                );
            }
        }
     }

     res.status(201).json(newTeam);
  } catch (error) {
    console.error('Error creating team:', error.message);
    res.status(500).json({ message: 'Failed to create team.' });
  }
};

const joinTeam = async (req, res) => {
    const db = req.db;
    const { uid } = req.user;
    const teamId = req.params.id;

    try {
        const { data: team } = await db.from('teams').select('*').eq('id', teamId).single();
        if (!team) return res.status(404).json({ message: 'Team not found' });
        
        // Fetch Profile
        const { data: profile } = await db.from('profiles').select('courses, profile_completed').eq('firebase_uid', uid).single();

        if (!profile.profile_completed) return res.status(403).json({ message: 'Complete profile first' });
        if (!profile.courses?.includes(team.course)) return res.status(403).json({ message: 'Not enrolled in this course' });

        // Check Existing Membership
        const { data: membership } = await db.from('team_members')
            .select('status')
            .eq('team_id', teamId)
            .eq('user_id', uid)
            .single();

        if (membership) {
            return res.status(409).json({ message: `You are already ${membership.status} in this team` });
        }
        
        // Check Capacity
        const { count: currentMembers } = await db.from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', teamId)
            .eq('status', 'accepted');
            
        if (currentMembers >= (team.max_members || 5)) {
            return res.status(409).json({ message: 'Team is full' });
        }

        // Insert Pending
        await db.from('team_members').insert({
            team_id: teamId,
            user_id: uid,
            status: 'pending'
        });

        // Notify Leader
        await sendNotification(
            team.created_by, 
            'team_request', 
            'New Join Request', 
            `A user has requested to join your team ${team.name}`,
            { teamId, requesterId: uid } // Metadata for actions
        );

        res.json({ message: 'Join request sent' });
    } catch(e) {
        console.error('Join Error:', e);
        res.status(400).json({ message: e.message || 'Join failed' });
    }
}

const updateMemberStatus = async (req, res) => {
    const db = req.db;
    const adminId = req.user.uid; 
    const { teamId, userId, status } = req.body; // status: 'accepted' | 'rejected'

    try {
        const { data: team } = await db.from('teams').select('*').eq('id', teamId).single();
        if (!team) return res.status(404).json({ message: 'Team not found' });
        if (team.created_by !== adminId) return res.status(403).json({ message: 'Only leader can manage members' });

        if (status === 'accepted') {
            // Check capacity again
            const { count } = await db.from('team_members').select('*', { count: 'exact', head: true }).eq('team_id', teamId).eq('status', 'accepted');
            if (count >= (team.max_members || 5)) {
                return res.status(409).json({ message: 'Team is already full' });
            }
        }

        const { error } = await db
            .from('team_members')
            .update({ status })
            .eq('team_id', teamId)
            .eq('user_id', userId);

        if (error) throw error;

        // Notify User
        await sendNotification(
            userId,
            'team_request',
            `Join Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
            `Your request to join "${team.name}" has been ${status}.`
        );
        
        // If Accepted and Full? maybe mark team as full explicitly if needed, or just let dynamic count handle it.

        res.json({ message: `Member ${status}` });
    } catch (error) {
        console.error('Error updating member status:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getTeams, createTeam, joinTeam, updateMemberStatus };
