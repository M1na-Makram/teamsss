const { db } = require('./config/db');
const admin = require('./config/firebase');

const seedFirestore = async () => {
    try {
        console.log('--- Starting Comprehensive Firestore Seeding ---');

        // 1. Seed Courses
        console.log('Seeding Courses...');
        const courses = [
            { code: 'CS101', name: 'Introduction to Computer Science', faculty: 'Engineering' },
            { code: 'CS202', name: 'Data Structures & Algorithms', faculty: 'Engineering' },
            { code: 'IT301', name: 'Network Security', faculty: 'Engineering' },
            { code: 'MATH101', name: 'Calculus I', faculty: 'Science' },
            { code: 'PHYS102', name: 'General Physics II', faculty: 'Science' },
            { code: 'BUS201', name: 'Principles of Management', faculty: 'Business' },
            { code: 'ENG105', name: 'Technical Writing', faculty: 'Arts' }
        ];

        const courseBatch = db.batch();
        courses.forEach(course => {
            const ref = db.collection('courses').doc(course.code);
            courseBatch.set(ref, {
                ...course,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            });
        });
        await courseBatch.commit();

        // 2. Seed Users
        console.log('Seeding Users...');
        const users = [
            {
                uid: 'admin-user-001',
                data: {
                    name: 'Dr. Ahmed Khalil',
                    email: 'ahmed.khalil@university.edu',
                    role: 'admin',
                    profile_completed: true,
                    faculty: 'Engineering',
                    photo_url: 'https://i.pravatar.cc/150?u=admin',
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                }
            },
            {
                uid: 'student-user-001',
                data: {
                    name: 'Omar Hassan',
                    email: 'omar.hassan@student.edu',
                    role: 'user',
                    profile_completed: true,
                    faculty: 'Engineering',
                    courses: ['CS101', 'CS202', 'IT301'],
                    photo_url: 'https://i.pravatar.cc/150?u=omar',
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                }
            },
            {
                uid: 'student-user-002',
                data: {
                    name: 'Laila Mahmoud',
                    email: 'laila.m@student.edu',
                    role: 'user',
                    profile_completed: true,
                    faculty: 'Engineering',
                    courses: ['CS202', 'IT301'],
                    photo_url: 'https://i.pravatar.cc/150?u=laila',
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                }
            },
            {
                uid: 'student-user-003',
                data: {
                    name: 'Youssef Ali',
                    email: 'youssef.ali@student.edu',
                    role: 'user',
                    profile_completed: true,
                    faculty: 'Science',
                    courses: ['MATH101', 'PHYS102'],
                    photo_url: 'https://i.pravatar.cc/150?u=youssef',
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                }
            }
        ];

        for (const user of users) {
            await db.collection('users').doc(user.uid).set(user.data);
        }

        // 3. Seed Teams
        console.log('Seeding Teams...');
        const teams = [
            {
                id: 'team-cyber-sec',
                data: {
                    name: 'The Guardians',
                    course_code: 'IT301',
                    faculty: 'Engineering',
                    term: 'Spring 2026',
                    leader_id: 'student-user-001',
                    leaderName: 'Omar Hassan',
                    max_members: 3,
                    description: 'Focused on implementing a secure communication protocol for the final project.',
                    status: 'active',
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                },
                members: [
                    { uid: 'student-user-001', name: 'Omar Hassan', status: 'accepted' },
                    { uid: 'student-user-002', name: 'Laila Mahmoud', status: 'accepted' }
                ]
            },
            {
                id: 'team-algo-masters',
                data: {
                    name: 'AlgoMasters',
                    course_code: 'CS202',
                    faculty: 'Engineering',
                    term: 'Spring 2026',
                    leader_id: 'student-user-002',
                    leaderName: 'Laila Mahmoud',
                    max_members: 4,
                    description: 'Solving complex dynamic programming problems together.',
                    status: 'active',
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                },
                members: [
                    { uid: 'student-user-002', name: 'Laila Mahmoud', status: 'accepted' }
                ]
            }
        ];

        for (const team of teams) {
            await db.collection('teams').doc(team.id).set(team.data);
            // Seed sub-collection members
            for (const member of team.members) {
                await db.collection('teams').doc(team.id).collection('members').doc(member.uid).set({
                    ...member,
                    joined_at: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        }

        // 4. Seed Notifications
        console.log('Seeding Notifications...');
        const notifications = [
            {
                user_id: 'student-user-001',
                type: 'admin_message',
                title: 'System Update',
                body: 'The registration deadline has been extended.',
                read: false,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            },
            {
                user_id: 'student-user-002',
                type: 'team_request',
                title: 'New Team Request',
                body: 'Omar Hassan invited you to join "The Guardians".',
                read: true,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }
        ];

        for (const notif of notifications) {
            await db.collection('notifications').add(notif);
        }

        // 5. Seed Ratings
        console.log('Seeding Ratings...');
        const ratings = [
            {
                from_user_id: 'student-user-002',
                to_user_id: 'student-user-001',
                team_id: 'team-cyber-sec',
                rating: 5,
                comment: 'Great leader, very organized!',
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }
        ];

        for (const rating of ratings) {
            await db.collection('ratings').add(rating);
        }

        console.log('--- Seeding Completed Successfully! ---');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding Firestore:', error);
        process.exit(1);
    }
};

seedFirestore();
