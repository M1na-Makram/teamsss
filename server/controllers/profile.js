const { createSupabaseToken, adminSupabase } = require('../db/supabaseClient');

// Validation format helpers
const isValidStudentId = (id) => /^\d{7,10}$/.test(id); // Approx 7-10 digits standard
const isValidPhone = (phone) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);

const validateStudentId = async (req, res) => {
  const { studentId } = req.body;
  const { uid } = req.user;
  
  if (!isValidStudentId(studentId)) {
    return res.status(400).json({ valid: false, message: 'Invalid Student ID format' });
  }

  // Check for duplicates
  const { data, error } = await adminSupabase
    .from('profiles')
    .select('firebase_uid')
    .eq('student_id', studentId)
    .neq('firebase_uid', uid) // exclude self
    .single();

  if (data) {
    return res.status(400).json({ valid: false, message: 'Student ID already registered' });
  }
  
  res.json({ valid: true });
};

const saveDraft = async (req, res) => {
  const { uid } = req.user;
  const draftData = req.body;
  
  try {
    const { error } = await adminSupabase
      .from('profiles')
      .upsert({
        firebase_uid: uid,
        email: req.user.email, // ensure email exists
        draft_data: draftData,
        updated_at: new Date()
      }, { onConflict: 'firebase_uid' });
      
    if (error) throw error;
    res.json({ saved: true });
  } catch (error) {
    console.error('Draft save error:', error.message);
    res.status(500).json({ message: 'Failed to save draft' });
  }
};

const completeProfile = async (req, res) => {
  // Use Admin Client to bypass RLS policy crashes for complete profile initial setup
  const db = adminSupabase;
  const { uid } = req.user;
  
  try {
    const { 
      fullName, 
      phone, 
      faculty, 
      academicTerm, 
      courses, 
      notificationPrefs, 
      photoUrl, 
      studentId, 
      group, 
      section,
      whatsappNumber,
      // Fallback for draft clearing handled by setting draft_data to null
    } = req.body;
    
    // 1. Validation
    if (!isValidStudentId(studentId)) return res.status(400).json({ message: 'Invalid Student ID' });
    if (!group || !section) return res.status(400).json({ message: 'Group and Section are required' });
    if (!courses || courses.length === 0) return res.status(400).json({ message: 'At least one course is required' });

    // 2. Immutability Check
    // Fetch existing profile to check if fields are already set (locked)
    const { data: existingProfile } = await db
      .from('profiles')
      .select('student_id, student_group, section, profile_completed')
      .eq('firebase_uid', uid)
      .single();

    if (existingProfile && existingProfile.profile_completed) {
      // Allow updates to mutable fields, but BLOCK immutable ones if they are changing
      if (existingProfile.student_id && existingProfile.student_id !== studentId) {
        return res.status(403).json({ message: 'Student ID is locked and cannot be changed.' });
      }
      // Depending on strictness, we might lock Group/Section too, prompt says "Fields to lock after first successful save: Student ID, Group, Section, WhatsApp Number"
      if (existingProfile.student_group && existingProfile.student_group !== group) {
        return res.status(403).json({ message: 'Group is locked.' });
      }
      if (existingProfile.section && existingProfile.section !== section) {
        return res.status(403).json({ message: 'Section is locked.' });
      }
    }
    
    // 3. Duplicate Checks (Double check before write)
    const { data: duplicateCheck } = await db
      .from('profiles')
      .select('firebase_uid')
      .eq('student_id', studentId)
      .neq('firebase_uid', uid)
      .single();
      
    if (duplicateCheck) {
      return res.status(409).json({ message: 'Student ID is already in use.' });
    }

    // 4. Update Profile
    const { error: profileError } = await db
      .from('profiles')
      .upsert({
        firebase_uid: uid,
        email: req.user.email, 
        name: fullName,
        photo_url: photoUrl,
        phone: phone,
        student_id: studentId,
        student_group: group, // Map input 'group' to db column 'student_group'
        section: section,
        whatsapp_number: whatsappNumber || phone, // Default to phone if not separate
        faculty: faculty,
        academic_term: academicTerm,
        courses: courses, 
        profile_completed: true,
        draft_data: null, // Clear draft
        updated_at: new Date()
      }, { onConflict: 'firebase_uid' });

    if (profileError) throw profileError;

    // 5. Notification Settings
    if (notificationPrefs) {
      const { error: settingsError } = await db
        .from('notification_settings')
        .upsert({
          user_id: uid,
          ...notificationPrefs
        });
        
       if (settingsError) {
         console.warn('Settings upsert failed:', settingsError.message);
       }
    }
    
    // 6. Return specific success with redirect instruction
    res.json({ message: 'Profile completed successfully', redirect: '/teams' });
    
  } catch (error) {
    console.error('Error completing profile:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  const { uid } = req.user;
  const db = req.db; // Use scoped DB

  try {
    const { data: profile, error } = await db
      .from('profiles')
      .select('*')
      .eq('firebase_uid', uid)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is 'Row not found'
       console.error('Profile fetch error:', error);
    }

    const { data: settings } = await db
      .from('notification_settings')
      .select('*')
      .eq('user_id', uid)
      .single();

    const token = createSupabaseToken(uid);

    res.json({
      id: profile?.firebase_uid || uid,
      ...(profile || {}),
      settings: settings || {},
      supabaseToken: token
    });
  } catch (error) {
    console.error('Error getting profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { completeProfile, getProfile, saveDraft, validateStudentId };
