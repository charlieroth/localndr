import type { Event } from '@/types'

export const initialEvents: Event[] = [
    {
        id: 1,
        title: 'Morning Stand-up',
        description: 'Daily team sync and progress updates',
        startDateTime: new Date(2025, 1, 3, 9, 30),
        endDateTime: new Date(2025, 1, 3, 10, 0),
    },
    {
        id: 2,
        title: 'Project Planning',
        description: 'Q1 roadmap and resource allocation',
        startDateTime: new Date(2025, 1, 3, 11, 0),
        endDateTime: new Date(2025, 1, 3, 12, 0),
    },
    {
        id: 3,
        title: 'Lunch with Marketing',
        description: 'Discuss upcoming campaign strategy',
        startDateTime: new Date(2025, 1, 3, 12, 30),
        endDateTime: new Date(2025, 1, 3, 13, 30),
    },
    {
        id: 4,
        title: 'Dentist Appointment',
        description: 'Regular checkup',
        startDateTime: new Date(2025, 1, 4, 14, 0),
        endDateTime: new Date(2025, 1, 4, 14, 45),
    },
    {
        id: 5,
        title: 'Team Building',
        description: 'Virtual escape room activity',
        startDateTime: new Date(2025, 1, 4, 16, 0),
        endDateTime: new Date(2025, 1, 4, 17, 30),
    },
    {
        id: 6,
        title: 'Code Review',
        description: 'Review pull requests for new feature',
        startDateTime: new Date(2025, 1, 5, 10, 0),
        endDateTime: new Date(2025, 1, 5, 10, 45),
    },
    {
        id: 7,
        title: 'Client Meeting',
        description: 'Project status update with stakeholders',
        startDateTime: new Date(2025, 1, 5, 13, 0),
        endDateTime: new Date(2025, 1, 5, 14, 0),
    },
    {
        id: 8,
        title: 'Gym Session',
        description: 'Upper body workout',
        startDateTime: new Date(2025, 1, 6, 7, 0),
        endDateTime: new Date(2025, 1, 6, 8, 0),
    },
    {
        id: 9,
        title: 'Design Review',
        description: 'Review new UI components',
        startDateTime: new Date(2025, 1, 6, 11, 0),
        endDateTime: new Date(2025, 1, 6, 11, 45),
    },
    {
        id: 10,
        title: 'Team Lunch',
        description: 'Monthly team bonding',
        startDateTime: new Date(2025, 1, 7, 12, 0),
        endDateTime: new Date(2025, 1, 7, 13, 30),
    },
    {
        id: 11,
        title: 'Product Demo',
        description: 'Showcase new features to stakeholders',
        startDateTime: new Date(2025, 1, 10, 14, 0),
        endDateTime: new Date(2025, 1, 10, 15, 0),
    },
    {
        id: 12,
        title: 'Coffee Chat',
        description: 'Catch up with mentor',
        startDateTime: new Date(2025, 1, 10, 16, 30),
        endDateTime: new Date(2025, 1, 10, 17, 0),
    },
    {
        id: 13,
        title: 'Sprint Planning',
        description: 'Plan next two weeks of work',
        startDateTime: new Date(2025, 1, 11, 10, 0),
        endDateTime: new Date(2025, 1, 11, 12, 0),
    },
    {
        id: 14,
        title: 'Yoga Class',
        description: 'Virtual yoga session',
        startDateTime: new Date(2025, 1, 11, 17, 0),
        endDateTime: new Date(2025, 1, 11, 18, 0),
    },
    {
        id: 15,
        title: 'Budget Review',
        description: 'Monthly financial planning',
        startDateTime: new Date(2025, 1, 12, 9, 0),
        endDateTime: new Date(2025, 1, 12, 10, 30),
    },
    {
        id: 16,
        title: "Doctor's Appointment",
        description: 'Annual checkup',
        startDateTime: new Date(2025, 1, 12, 14, 30),
        endDateTime: new Date(2025, 1, 12, 15, 30),
    },
    {
        id: 17,
        title: 'Team Training',
        description: 'New tool onboarding session',
        startDateTime: new Date(2025, 1, 13, 11, 0),
        endDateTime: new Date(2025, 1, 13, 13, 0),
    },
    {
        id: 18,
        title: 'Project Deadline',
        description: 'Submit Q1 deliverables',
        startDateTime: new Date(2025, 1, 14, 17, 0),
        endDateTime: new Date(2025, 1, 14, 17, 0),
    },
    {
        id: 19,
        title: 'Morning Run',
        description: '5k training',
        startDateTime: new Date(2025, 1, 17, 6, 30),
        endDateTime: new Date(2025, 1, 17, 7, 15),
    },
    {
        id: 20,
        title: 'All-Hands Meeting',
        description: 'Company updates and announcements',
        startDateTime: new Date(2025, 1, 17, 10, 0),
        endDateTime: new Date(2025, 1, 17, 11, 0),
    },
    {
        id: 21,
        title: 'Lunch & Learn',
        description: 'Guest speaker on AI trends',
        startDateTime: new Date(2025, 1, 17, 12, 0),
        endDateTime: new Date(2025, 1, 17, 13, 0),
    },
    {
        id: 22,
        title: '1:1 with Manager',
        description: 'Weekly check-in',
        startDateTime: new Date(2025, 1, 18, 14, 0),
        endDateTime: new Date(2025, 1, 18, 14, 30),
    },
    {
        id: 23,
        title: 'Tech Talk',
        description: 'New framework introduction',
        startDateTime: new Date(2025, 1, 18, 15, 0),
        endDateTime: new Date(2025, 1, 18, 15, 45),
    },
    {
        id: 24,
        title: 'Team Retrospective',
        description: 'Sprint review and feedback',
        startDateTime: new Date(2025, 1, 19, 10, 0),
        endDateTime: new Date(2025, 1, 19, 11, 0),
    },
    {
        id: 25,
        title: 'Client Workshop',
        description: 'Requirements gathering session',
        startDateTime: new Date(2025, 1, 19, 13, 0),
        endDateTime: new Date(2025, 1, 19, 16, 0),
    },
    {
        id: 26,
        title: 'Dentist Follow-up',
        description: 'Check filling',
        startDateTime: new Date(2025, 1, 20, 9, 0),
        endDateTime: new Date(2025, 1, 20, 9, 30),
    },
    {
        id: 27,
        title: 'Product Strategy',
        description: 'Q2 planning session',
        startDateTime: new Date(2025, 1, 20, 11, 0),
        endDateTime: new Date(2025, 1, 20, 13, 0),
    },
    {
        id: 28,
        title: 'Team Happy Hour',
        description: 'Virtual social gathering',
        startDateTime: new Date(2025, 1, 21, 16, 30),
        endDateTime: new Date(2025, 1, 21, 18, 0),
    },
    {
        id: 29,
        title: 'Morning Meditation',
        description: 'Group mindfulness session',
        startDateTime: new Date(2025, 1, 24, 8, 0),
        endDateTime: new Date(2025, 1, 24, 8, 30),
    },
    {
        id: 30,
        title: 'Security Training',
        description: 'Annual compliance review',
        startDateTime: new Date(2025, 1, 24, 10, 0),
        endDateTime: new Date(2025, 1, 24, 12, 0),
    },
    {
        id: 31,
        title: 'Project Kickoff',
        description: 'New client project initiation',
        startDateTime: new Date(2025, 1, 24, 14, 0),
        endDateTime: new Date(2025, 1, 24, 15, 30),
    },
    {
        id: 32,
        title: 'Code Workshop',
        description: 'Best practices session',
        startDateTime: new Date(2025, 1, 25, 11, 0),
        endDateTime: new Date(2025, 1, 25, 13, 0),
    },
    {
        id: 33,
        title: 'Vendor Meeting',
        description: 'Service review and renewal',
        startDateTime: new Date(2025, 1, 25, 15, 0),
        endDateTime: new Date(2025, 1, 25, 16, 0),
    },
    {
        id: 34,
        title: 'Team Lunch',
        description: 'Welcome new team members',
        startDateTime: new Date(2025, 1, 26, 12, 0),
        endDateTime: new Date(2025, 1, 26, 13, 30),
    },
    {
        id: 35,
        title: 'Performance Review',
        description: 'Quarterly evaluation',
        startDateTime: new Date(2025, 1, 26, 14, 0),
        endDateTime: new Date(2025, 1, 26, 15, 0),
    },
    {
        id: 36,
        title: 'UI/UX Workshop',
        description: 'Design system updates',
        startDateTime: new Date(2025, 1, 26, 15, 30),
        endDateTime: new Date(2025, 1, 26, 17, 30),
    },
    {
        id: 37,
        title: 'Morning Workout',
        description: 'HIIT session',
        startDateTime: new Date(2025, 1, 27, 7, 0),
        endDateTime: new Date(2025, 1, 27, 7, 45),
    },
    {
        id: 38,
        title: 'Architecture Review',
        description: 'System design discussion',
        startDateTime: new Date(2025, 1, 27, 10, 0),
        endDateTime: new Date(2025, 1, 27, 11, 30),
    },
    {
        id: 39,
        title: 'Client Presentation',
        description: 'Project milestone review',
        startDateTime: new Date(2025, 1, 27, 14, 0),
        endDateTime: new Date(2025, 1, 27, 15, 0),
    },
    {
        id: 40,
        title: 'Team Building',
        description: 'Online gaming session',
        startDateTime: new Date(2025, 1, 27, 16, 0),
        endDateTime: new Date(2025, 1, 27, 18, 0),
    },
    {
        id: 41,
        title: 'Sprint Demo',
        description: 'Show and tell new features',
        startDateTime: new Date(2025, 1, 28, 10, 0),
        endDateTime: new Date(2025, 1, 28, 11, 0),
    },
    {
        id: 42,
        title: 'Lunch Break',
        description: 'Team pizza party',
        startDateTime: new Date(2025, 1, 28, 12, 0),
        endDateTime: new Date(2025, 1, 28, 13, 0),
    },
    {
        id: 43,
        title: 'Stakeholder Meeting',
        description: 'Monthly progress update',
        startDateTime: new Date(2025, 1, 28, 14, 0),
        endDateTime: new Date(2025, 1, 28, 15, 30),
    },
    {
        id: 44,
        title: 'Code Deploy',
        description: 'Production release',
        startDateTime: new Date(2025, 1, 28, 16, 0),
        endDateTime: new Date(2025, 1, 28, 17, 0),
    },
    {
        id: 45,
        title: 'Team Sync',
        description: 'Cross-functional alignment',
        startDateTime: new Date(2025, 1, 28, 17, 30),
        endDateTime: new Date(2025, 1, 28, 18, 0),
    },
    {
        id: 46,
        title: 'Morning Stand-up',
        description: 'Daily team check-in',
        startDateTime: new Date(2025, 1, 28, 9, 30),
        endDateTime: new Date(2025, 1, 28, 9, 45),
    },
    {
        id: 47,
        title: 'Design Critique',
        description: 'Review new mockups',
        startDateTime: new Date(2025, 1, 28, 11, 0),
        endDateTime: new Date(2025, 1, 28, 11, 45),
    },
    {
        id: 48,
        title: 'Career Development',
        description: 'Goal setting session',
        startDateTime: new Date(2025, 1, 28, 13, 0),
        endDateTime: new Date(2025, 1, 28, 13, 45),
    },
    {
        id: 49,
        title: 'Product Review',
        description: 'Feature prioritization',
        startDateTime: new Date(2025, 1, 28, 15, 0),
        endDateTime: new Date(2025, 1, 28, 15, 45),
    },
    {
        id: 50,
        title: 'End of Month Review',
        description: 'Monthly metrics review',
        startDateTime: new Date(2025, 1, 28, 16, 30),
        endDateTime: new Date(2025, 1, 28, 17, 30),
    },
]
