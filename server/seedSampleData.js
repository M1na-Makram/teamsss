const { adminSupabase } = require('./db/supabaseClient');

const seedData = async () => {
    try {
        console.log('Seeding Supabase Sample Data...');

        // 1. Seed Courses
        const courses = [
            { code: 'CS101', name: 'Intro to Computer Science', faculty: 'Engineering' },
            { code: 'IT202', name: 'Information Systems', faculty: 'Engineering' }
        ];

        const { error: courseError } = await adminSupabase.from('courses').upsert(courses, { onConflict: 'code' });
        if (courseError) console.error('Error seeding courses:', courseError);
        else console.log('Courses seeded.');

        // 2. Seed Sample Admin User
        // Note: In a real scenario, this user must exist in Firebase Auth first.
        // We will assume the UID matches a real Firebase User or just a placeholder for DB consistency checking.
        // The user should run this AFTER logging in or creating a user, OR replace this UID with their own.
        const adminId = 'sample-admin-uid'; 
        
        const { error: profileError } = await adminSupabase.from('profiles').upsert({
            firebase_uid: adminId,
            name: 'Mina Makar',
            email: 'minamakr1234@gmail.com',
            role: 'admin',
            profile_completed: true,
            photo_url: 'https://placehold.co/100x100',
            faculty: 'Engineering',
            courses: ['CS101', 'IT202']
        });
        if (profileError) console.error('Error seeding profile:', profileError);
        else console.log('Admin Profile seeded.');

        // 3. Seed Sample Team
        const { data: team, error: teamError } = await adminSupabase.from('teams').insert({
            name: 'Cyber Security Squad',
            course_code: 'CS101',
            faculty: 'Engineering',
            term: 'Fall 2025',
            created_by: adminId,
            max_members: 4,
            description: 'Looking for enthusiasts.',
            status: 'active'
        }).select().single();

        if (teamError) {
             console.error('Error seeding team:', teamError);
        } else {
            console.log('Team seeded.');
            
            // 4. Add Member
            const { error: memberError } = await adminSupabase.from('team_members').insert({
                team_id: team.id,
                user_id: adminId,
                role: 'owner',
                status: 'accepted'
            });
            if (memberError) console.error('Error seeding member:', memberError);
            else console.log('Member seeded.');
        }

        // 5. Seed Notification
        const { error: notifError } = await adminSupabase.from('notifications').insert({
            user_id: adminId,
            type: 'admin_message',
            title: 'Welcome!',
            body: 'Welcome to the Team Management Platform (Supabase Edition)!',
            read: false
        });
        if (notifError) console.error('Error seeding notification:', notifError);
        else console.log('Notification seeded.');

        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding sample data:', error);
        process.exit(1);
    }
};

seedData();
