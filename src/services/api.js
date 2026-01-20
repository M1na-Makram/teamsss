import { supabase } from '../lib/supabaseClient';

/**
 * API Service for direct Supabase interaction.
 */

// Direct Supabase Interaction Service
export const authApi = {
  syncUser: async (user, profileData = {}) => {
    // Direct upsert to Supabase profiles table
    const { data: profile, error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      name: profileData.name || user.user_metadata?.full_name || user.email?.split('@')[0],
      photo_url: profileData.photo_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
      updated_at: new Date(),
    }, { onConflict: 'id' }).select().single();

    if (error) {
        console.error('Supabase sync error:', error);
        throw error;
    }

    // Ensure notification settings exist
    try {
        const { error: settingsError } = await supabase.from('notification_settings').upsert(
            { user_id: user.id },
            { onConflict: 'user_id' }
        );
        
        if (settingsError) {
            console.error('Notification settings sync error:', settingsError);
            // Don't throw here, settings are not critical for login
        }
    } catch (e) {
        console.warn('Caught settings error:', e);
    }

    return { user: profile };
  },
  updateToken: async (token) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return supabase.from('profiles').update({ fcm_token: token }).eq('id', user.id);
  }
};

export const profileApi = {
  getMe: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null };
    
    // Select everything from profiles
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    
    if (error) {
        console.warn('api.getMe profile fetch error:', error);
    }

    // Also get settings
    const { data: settings } = await supabase.from('notification_settings').select('*').eq('user_id', user.id).maybeSingle();
    
    return { 
        data: { 
            ...(profile || {}), 
            settings: settings || {} 
        } 
    };
  },
  completeProfile: async (profileData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { 
        fullName, phone, faculty, specialization, courses, 
        notificationPrefs, photoUrl, studentId, whatsappNumber 
    } = profileData;

    // 1. Update Profile
    const { data, error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        name: fullName,
        phone: phone,
        student_id: studentId,
        whatsapp_number: whatsappNumber || phone,
        faculty: faculty,
        specialization: specialization || null,
        courses: courses,
        profile_completed: true,
        photo_url: photoUrl,
        draft_data: null,
        updated_at: new Date()
    }, { onConflict: 'id' }).select().single();

    if (error) throw error;

    // 2. Update Notification Settings
    if (notificationPrefs) {
        await supabase.from('notification_settings').upsert({
            user_id: user.id,
            ...notificationPrefs
        });
    }

    return { data: { ...data, redirect: '/teams' } };
  },
  saveDraft: async (draftData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    return supabase.from('profiles').update({ draft_data: draftData, updated_at: new Date() }).eq('id', user.id);
  },
  validateStudentId: async (studentId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: { valid: true } };
    const { data } = await supabase.from('profiles')
        .select('id')
        .eq('student_id', studentId)
        .neq('id', user?.id)
        .maybeSingle();
    return { data: { valid: !data } };
  }
};

export const coursesApi = {
  getAll: async () => {
    return supabase.from('courses').select('*').order('code');
  },
  getFaculties: async () => {
    // Get distinct faculties from courses table
    const { data, error } = await supabase.from('courses').select('faculty');
    if (error) throw error;
    // Get unique faculties
    const uniqueFaculties = [...new Set(data?.map(c => c.faculty).filter(Boolean))];
    return { data: uniqueFaculties };
  }
};

export const teamsApi = {
  getTeams: async (filters = {}) => {
    const { data: { user } } = await supabase.auth.getUser();

    // Joining with leaders and member status
    let query = supabase.from('teams').select(`
      *,
      profiles!created_by(name),
      members:team_members(count),
      my_membership:team_members(status, user_id)
    `);

    // Apply filters (empty string means 'all')
    if (filters.course && filters.course !== '') query = query.eq('course_code', filters.course);
    if (filters.faculty && filters.faculty !== '') query = query.eq('faculty', filters.faculty);
    if (filters.specialization && filters.specialization !== '') query = query.eq('specialization', filters.specialization);
    if (filters.group && filters.group !== '') query = query.eq('lecture_group', parseInt(filters.group));
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return { 
        data: data.map(t => {
            const myStatusObj = t.my_membership?.find(m => m.user_id === user?.id);
            const myStatus = myStatusObj?.status;
            
            return {
                ...t,
                course: t.course_code, 
                leaderName: t.profiles?.name || 'Unknown',
                memberCount: t.members?.[0]?.count || 0,
                userStatus: myStatus
            };
        })
    };
  },
  createTeam: async (teamData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { invitedStudents, ...insertData } = teamData;
        
        // Fetch current user details for auto-filling metadata if missing
        const { data: profile } = await supabase
            .from('profiles')
            .select('faculty, specialization')
            .eq('id', user.id)
            .single();

        const { data: newTeam, error } = await supabase.from('teams').insert({
            name: insertData.name,
            description: insertData.description,
            course_code: insertData.courseCode,
            max_members: insertData.maxMembers,
            created_by: user.id,
            lecture_group: insertData.lectureGroup,
            section: insertData.section,
            faculty: profile?.faculty,
            specialization: profile?.specialization
        }).select().single();

        if (error) throw error;

        // Auto-add self as owner
        await supabase.from('team_members').insert({
            team_id: newTeam.id,
            user_id: user.id,
            role: 'owner',
            status: 'accepted'
        });

        // Invitations
        if (invitedStudents?.length > 0) {
            for (const studentId of invitedStudents) {
                try {
                    await supabase.rpc('invite_by_student_id', { 
                        p_team_id: newTeam.id, 
                        p_student_id: studentId 
                    });
                } catch (e) { console.warn('Invite failed for', studentId, e.message); }
            }
        }

        return { data: newTeam };
    } catch (error) {
        console.error('createTeam API error:', error);
        throw error;
    }
  },
  joinTeam: async (teamId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Check if user was previously rejected (blocked)
    const { data: existingMembership } = await supabase
        .from('team_members')
        .select('status, rejected_at')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .maybeSingle();
    
    if (existingMembership?.status === 'rejected' || existingMembership?.status === 'REJECTED' || existingMembership?.status === 'BLOCKED') {
        throw new Error('You were rejected by the team leader and cannot join this team again.');
    }
    
    // Check if team is active
    const { data: team } = await supabase.from('teams').select('status').eq('id', teamId).maybeSingle();
    // If status column is missing or team doesn't exist, we default to ACTIVE to avoid blocking
    const currentStatus = team?.status || 'ACTIVE';
    
    if (currentStatus !== 'ACTIVE' && currentStatus !== 'active') {
        throw new Error('This team is not accepting new members.');
    }
    
    return supabase.from('team_members').insert({
        team_id: teamId,
        user_id: user.id,
        status: 'pending'
    });
  },
  reportTeam: async (teamId, reason = null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Use RPC function for atomic operation
    const { data, error } = await supabase.rpc('report_team', { 
        p_team_id: teamId, 
        p_reason: reason 
    });
    
    if (error) throw error;
    return { data };
  },
  checkBlockedStatus: async (teamId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { blocked: false };
    
    const { data } = await supabase
        .from('team_members')
        .select('status')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .in('status', ['rejected', 'REJECTED', 'BLOCKED'])
        .maybeSingle();
    
    return { blocked: !!data };
  },
  leaveTeam: async (teamId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    // Using delete with user_id to ensure RLS pass
    return supabase.from('team_members').delete().eq('team_id', teamId).eq('user_id', user.id);
  },
  updateMemberStatus: async (teamId, userId, status) => {
    if (status === 'removed' || status === 'rejected') {
        return supabase.from('team_members').delete().eq('team_id', teamId).eq('user_id', userId);
    }
    return supabase.from('team_members').update({ status }).match({ team_id: teamId, user_id: userId });
  },
  getMyTeams: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };

    const { data: memberships, error } = await supabase
        .from('team_members')
        .select(`
            status,
            role,
            team:teams (
                *,
                profiles!created_by(name),
                members:team_members(count)
            )
        `)
        .eq('user_id', user.id);

    if (error) throw error;

    return {
        data: memberships?.map(m => ({
            ...m.team,
            userStatus: m.status,
            userRole: m.role,
            course: m.team.course_code,
            leaderName: m.team.profiles?.name || 'Unknown',
            memberCount: m.team.members?.[0]?.count || 0
        })) || []
    };
  },
  getTeamDetails: async (teamId) => {
    const { data: team, error } = await supabase
        .from('teams')
        .select(`
            *,
            profiles!created_by(name, student_id, email, photo_url),
            members:team_members(
                status,
                role,
                user_id,
                profiles:user_id(name, student_id, email, photo_url, id)
            )
        `)
        .eq('id', teamId)
        .single();
    
    if (error) throw error;
    return { data: team };
  },
  updateTeam: async (teamId, updateData) => {
    const mappedData = {
        name: updateData.name,
        description: updateData.description,
        max_members: updateData.maxMembers
    };
    return supabase.from('teams').update(mappedData).eq('id', teamId);
  },
  deleteTeam: async (teamId) => {
    return supabase.from('teams').delete().eq('id', teamId);
  },
  getPendingRequests: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };

    // Requests for teams created by this user
    const { data, error } = await supabase
        .from('team_members')
        .select(`
            *,
            team:teams!inner(name, course_code, created_by),
            profiles:user_id(name, student_id, email, id)
        `)
        .eq('team.created_by', user.id)
        .eq('status', 'pending');

    if (error) throw error;
    return { data };
  }
};

export const notificationsApi = {
  getNotifications: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };
    return supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  },
  getUnreadCount: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: { count: 0 } };
    const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false);
    return { data: { count: count || 0 } };
  },
  markAsRead: async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    return supabase.from('notifications').update({ read: true }).eq('id', id).eq('user_id', user.id);
  },
  markAllAsRead: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    return supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
  },
  deleteAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    return supabase.from('notifications').delete().eq('user_id', user.id);
  }
};

export const adminApi = {
  getStats: async () => {
    const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: teams } = await supabase.from('teams').select('*', { count: 'exact', head: true });
    const { count: pendingUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending');
    
    // Distribution for charts
    const { data: distribution } = await supabase.from('teams').select('course_code');
    
    return { data: { users, teams, pendingUsers, distribution } };
  },
  getUsers: (filters = {}) => {
    let query = supabase.from('profiles').select('*');
    if (filters.status && filters.status !== 'all') query = query.eq('approval_status', filters.status);
    if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,student_id.ilike.%${filters.search}%`);
    }
    return query.order('created_at', { ascending: false });
  },
  approveUser: async (userId, status) => {
    const approved = status === 'approved';
    const { error } = await supabase.from('profiles').update({ 
        approved, 
        approval_status: status 
    }).eq('id', userId);
    
    if (!error) {
        await adminApi.logAction('USER_APPROVAL', { userId, status });
        
            // Direct Insert (Allowed by FIX_NOTIFICATIONS_DIRECT_ACCESS.sql)
            const { error: notifError } = await supabase.from('notifications').insert({
                user_id: userId,
                type: 'admin_message',
                title: status === 'approved' ? 'Account Approved' : 'Account Rejected',
                body: status === 'approved' 
                    ? 'Your account has been approved. You can now create and join teams!' 
                    : 'Your account application was rejected. Please contact support.',
                metadata: { system: true }
            });
            if (notifError) console.warn('Approval notification warning:', notifError.message);
    }
    return { error };
  },
  
  // Courses
  getCourses: () => supabase.from('courses').select('*').order('code'),
  addCourse: (course) => supabase.from('courses').insert(course),
  updateCourse: (id, course) => supabase.from('courses').update(course).eq('id', id),
  deleteCourse: (id) => supabase.from('courses').delete().eq('id', id),

  // Templates
  getTemplates: () => supabase.from('notification_templates').select('*').order('created_at', { ascending: false }),
  addTemplate: (template) => supabase.from('notification_templates').insert(template),
  deleteTemplate: (id) => supabase.from('notification_templates').delete().eq('id', id),

  // Audit Logs
  getAuditLogs: () => supabase.from('audit_logs').select(`
    *,
    profiles!admin_id(name)
  `).order('created_at', { ascending: false }),
  logAction: async (action, details) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    return supabase.from('audit_logs').insert({ 
        admin_id: user.id, 
        action, 
        details 
    });
  },

  deleteUser: async (userId) => {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (!error) await adminApi.logAction('DELETE_USER', { userId });
    return { error };
  },

  // Full Teams Visibility
  getAllTeams: async (filters = {}) => {
    let query = supabase.from('teams').select(`
      *,
      profiles!created_by(name, id, email, student_id),
      members:team_members(
        status,
        role,
        profiles:user_id(name, email, student_id, id)
      )
    `);
    
    if (filters.course && filters.course !== '') query = query.eq('course_code', filters.course);
    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  updateUserRole: async (userId, role) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
    if (!error) await adminApi.logAction('UPDATE_USER_ROLE', { userId, role });
    return { error };
  },

  // Spam Review
  getPausedTeams: async () => {
    const { data, error } = await supabase.from('teams')
      .select(`*, profiles!created_by(name, email), reports:team_reports(count)`)
      .eq('status', 'PAUSED');
    return { data, error };
  },
  confirmSpam: async (teamId) => {
    const { error } = await supabase.from('teams').update({ status: 'DELETED' }).eq('id', teamId);
    if (!error) await adminApi.logAction('CONFIRM_SPAM', { teamId });
    return { error };
  },
  clearSpam: async (teamId) => {
    const { error } = await supabase.from('teams').update({ status: 'ACTIVE', spam_count: 0 }).eq('id', teamId);
    if (!error) {
      await supabase.from('team_reports').delete().eq('team_id', teamId);
      await adminApi.logAction('CLEAR_SPAM', { teamId });
    }
    return { error };
  },

  // Doctor Management
  getDoctors: async () => {
    const { data, error } = await supabase.from('profiles')
      .select(`
        *,
        assignments:doctor_course_assignments!doctor_id(
          course:courses(*)
        )
      `)
      .eq('role', 'doctor');
    return { data, error };
  },
  assignDoctorToCourse: async (doctorId, courseId) => {
    const { error } = await supabase.from('doctor_course_assignments').upsert({
      doctor_id: doctorId,
      course_id: courseId
    }, { onConflict: 'doctor_id,course_id' });
    
    if (!error) {
      await adminApi.logAction('ASSIGN_DOCTOR_COURSE', { doctorId, courseId });
      // Notify doctor
      const { data: course } = await supabase.from('courses').select('name').eq('id', courseId).single();
      // Use ignoreDuplicates or simple catch for notification conflicts
      // Direct Insert
      const { error: notifError } = await supabase.from('notifications').insert({
        user_id: doctorId,
        type: 'doctor_assignment',
        title: 'Course Assignment',
        body: `You have been assigned to course: ${course?.name || courseId}`,
        metadata: { courseId }
      });
      if (notifError) console.warn('Doctor assignment notification warning:', notifError.message);
    }
    return { error };
  },
  assignDoctorToTeam: async (doctorId, teamId) => {
    const { error } = await supabase.from('teams').update({ assigned_doctor: doctorId }).eq('id', teamId);
    if (!error) await adminApi.logAction('ASSIGN_DOCTOR_TEAM', { doctorId, teamId });
    return { error };
  },
  removeDoctorFromCourse: async (doctorId, courseId) => {
    const { error } = await supabase.from('doctor_course_assignments').delete().match({ doctor_id: doctorId, course_id: courseId });
    if (!error) await adminApi.logAction('REMOVE_DOCTOR_COURSE', { doctorId, courseId });
    return { error };
  },

  broadcastNotification: async (data) => {
    // Ensuring column names match MASTER_DB_FIX
    const { error } = await supabase.from('admin_broadcasts').insert({
        title: data.title,
        body: data.body,
        type: data.type || 'broadcast'
    });
    if (!error) await adminApi.logAction('BROADCAST_NOTIFICATION', data);
    return { error };
  },

  sendDirectNotification: async (userId, title, body) => {
    const { error: insertError } = await supabase.from('notifications').insert({
        user_id: userId,
        type: 'admin_message',
        title,
        body
    });
    
    // Log the action even if notification fails (best effort)
    await adminApi.logAction('DIRECT_NOTIFICATION', { userId, title });
    return { error: insertError };
  }
};

// ===========================
// DOCTOR API
// ===========================
export const doctorApi = {
  // Get teams assigned to this doctor
  getMyAssignedTeams: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };
    
    // Step 1: Check if user is admin or doctor
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    
    if (profileError) console.error('Error fetching profile for role check:', profileError);
    
    const userRole = (profile?.role || '').toLowerCase();
    const isAdmin = userRole === 'admin';
    console.log('Detected User Role:', userRole, 'Is Admin:', isAdmin);

    // Step 2: Get the teams
    let query = supabase.from('teams')
      .select(`
        *,
        members:team_members(
          status,
          role,
          profiles:user_id(name, email, student_id, id, whatsapp_number)
        )
      `);
    
    if (!isAdmin) {
        console.log('Filtering teams for assigned doctor:', user.id);
        query = query.eq('assigned_doctor', user.id);
    } else {
        console.log('Admin detected: loading all teams for manifest.');
    }

    const { data: teams, error } = await query;
    if (error) return { data: [], error };
    if (!teams || teams.length === 0) return { data: [] };

    // Step 3: Manually attach course data
    const courseCodes = [...new Set(teams.map(t => t.course_code))].filter(Boolean);
    const { data: courses } = await supabase.from('courses')
        .select('name, code')
        .in('code', courseCodes);

    const dataWithCourses = teams.map(team => {
        const cCode = team.course_code || 'UNSET';
        return {
            ...team,
            course_data: courses?.find(c => c.code === cCode) || { name: cCode, code: cCode }
        };
    });
    
    return { data: dataWithCourses, error: null };
  },

  // Get all teams for doctor's assigned courses
  getTeamsByCourses: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };
    
    // Get user role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const isAdmin = profile?.role === 'admin';

    let query = supabase.from('teams')
      .select(`
        *,
        members:team_members(
          status,
          role,
          profiles:user_id(name, email, student_id, id, whatsapp_number)
        )
      `);
    
    let coursesData = [];
    if (!isAdmin) {
        const { data: assignments } = await supabase.from('doctor_course_assignments')
          .select('course_id')
          .eq('doctor_id', user.id);
        
        if (!assignments?.length) return { data: [], courses: [] };
        
        const { data: courses } = await supabase.from('courses')
          .select('id, code, name')
          .in('id', assignments.map(a => a.course_id));
        
        coursesData = courses || [];
        const courseCodes = coursesData.map(c => c.code) || [];
        if (courseCodes.length === 0) return { data: [], courses: coursesData };
        
        query = query.in('course_code', courseCodes);
    } else {
        const { data: allCourses } = await supabase.from('courses').select('id, code, name');
        coursesData = allCourses || [];
    }

    const { data: teams, error } = await query
      .neq('status', 'DELETED')
      .order('created_at', { ascending: false });
    
    if (error) return { data: [], error, courses: coursesData };

    const dataWithCourses = teams?.map(team => ({
        ...team,
        course_data: coursesData.find(c => c.code === team.course_code) || { name: team.course_code, code: team.course_code }
    }));

    return { data: dataWithCourses, error: null, courses: coursesData };
  },

  // Get team details for PDF export
  getTeamForExport: async (teamId) => {
    const { data, error } = await supabase.from('teams')
      .select(`
        name,
        course_code,
        time_slot_start,
        time_slot_end,
        members:team_members(
          status,
          role,
          profiles:user_id(name, student_id, email, whatsapp_number)
        )
      `)
      .eq('id', teamId)
      .single();
    
    return { data, error };
  },

  // Assign time slots to multiple teams
  assignTimeSlots: async (teamIds, startTime, durationMinutes) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const results = [];
    let currentTime = new Date(startTime);
    
    for (const teamId of teamIds) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000);
      
      const { error } = await supabase.from('teams').update({
        time_slot_start: slotStart.toISOString(),
        time_slot_end: slotEnd.toISOString()
      }).eq('id', teamId);
      
      if (!error) {
          // Notify team members
          const { data: members } = await supabase.from('team_members').select('user_id').eq('team_id', teamId).eq('status', 'accepted');
          if (members) {
              for (const member of members) {
                  const { error: notifError } = await supabase.from('notifications').insert({
                      user_id: member.user_id,
                      type: 'time_slot',
                      title: 'Presentation Scheduled',
                      body: `Your team presentation has been scheduled for ${slotStart.toLocaleString()}`,
                      metadata: { teamId, slotStart: slotStart.toISOString() }
                  });
                  if (notifError) console.warn('Time slot notification warning:', notifError.message);
              }
          }
      }
      
      results.push({ teamId, slotStart, slotEnd, error });
      currentTime = slotEnd;
    }
    
    return { data: results };
  },

  // Get doctor's assigned courses
  getMyAssignedCourses: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };
    
    const { data, error } = await supabase.from('doctor_course_assignments')
      .select(`
        course:courses(id, code, name, faculty)
      `)
      .eq('doctor_id', user.id);
    
    return { data: data?.map(d => d.course) || [], error };
  }
};

const api = {
    auth: authApi,
    profile: profileApi,
    teams: teamsApi,
    notifications: notificationsApi,
    admin: adminApi,
    doctor: doctorApi
};
export default api;

