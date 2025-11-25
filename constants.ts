import { Room, Building, Amenity, FilterState, UniEvent, EventCategory } from './types';

// Helper to generate a simple schedule
// Mon-Fri: Classes mostly 9-11 and 13-15
const standardSchedule = {
  1: [{ start: 900, end: 1100, course: 'CS101' }, { start: 1300, end: 1430, course: 'MATH202' }],
  2: [{ start: 1000, end: 1200, course: 'PHY101' }],
  3: [{ start: 900, end: 1100, course: 'CS101' }, { start: 1400, end: 1600, course: 'LAB3' }],
  4: [{ start: 1100, end: 1230, course: 'ENG303' }],
  5: [{ start: 900, end: 1000, course: 'SEMINAR' }]
};

const busySchedule = {
  1: [{ start: 800, end: 1700, course: 'ALL DAY LAB' }],
  2: [{ start: 900, end: 1200, course: 'LAB' }, { start: 1300, end: 1600, course: 'LAB' }],
  3: [{ start: 800, end: 1700, course: 'ALL DAY LAB' }],
  4: [{ start: 900, end: 1200, course: 'LAB' }],
  5: []
};

const emptySchedule = { 1: [], 2: [], 3: [], 4: [], 5: [] };

export const MOCK_ROOMS: Room[] = [
  {
    id: 'e101',
    name: 'E-101 Lecture Hall',
    building: Building.ENGINEERING,
    floor: 1,
    capacity: 120,
    amenities: [Amenity.PROJECTOR, Amenity.AC, Amenity.OUTLETS],
    schedule: standardSchedule,
    imageUrl: 'https://picsum.photos/400/300'
  },
  {
    id: 'e102',
    name: 'E-102 Small Class',
    building: Building.ENGINEERING,
    floor: 1,
    capacity: 30,
    amenities: [Amenity.WHITEBOARD, Amenity.OUTLETS],
    schedule: { ...standardSchedule, 1: [] }, // Free on Monday
    imageUrl: 'https://picsum.photos/400/301'
  },
  {
    id: 'e205',
    name: 'E-205 Computer Lab',
    building: Building.ENGINEERING,
    floor: 2,
    capacity: 40,
    amenities: [Amenity.COMPUTERS, Amenity.AC, Amenity.PROJECTOR],
    schedule: busySchedule,
    imageUrl: 'https://picsum.photos/400/302'
  },
  {
    id: 's301',
    name: 'S-301 Chemistry Lab',
    building: Building.SCIENCE,
    floor: 3,
    capacity: 25,
    amenities: [Amenity.WHITEBOARD, Amenity.AC],
    schedule: busySchedule,
    imageUrl: 'https://picsum.photos/400/303'
  },
  {
    id: 's105',
    name: 'S-105 Study Room',
    building: Building.SCIENCE,
    floor: 1,
    capacity: 10,
    amenities: [Amenity.QUIET_ZONE, Amenity.OUTLETS, Amenity.WHITEBOARD],
    schedule: emptySchedule, // Always free
    imageUrl: 'https://picsum.photos/400/304'
  },
  {
    id: 'a202',
    name: 'A-202 Seminar Room',
    building: Building.ARTS,
    floor: 2,
    capacity: 50,
    amenities: [Amenity.PROJECTOR, Amenity.AC],
    schedule: standardSchedule,
    imageUrl: 'https://picsum.photos/400/305'
  },
  {
    id: 'l404',
    name: 'L-404 Group Pod',
    building: Building.LIBRARY,
    floor: 4,
    capacity: 6,
    amenities: [Amenity.QUIET_ZONE, Amenity.OUTLETS],
    schedule: emptySchedule,
    imageUrl: 'https://picsum.photos/400/306'
  },
  {
    id: 'l101',
    name: 'L-101 Main Hall',
    building: Building.LIBRARY,
    floor: 1,
    capacity: 200,
    amenities: [Amenity.AC, Amenity.OUTLETS],
    schedule: busySchedule,
    imageUrl: 'https://picsum.photos/400/307'
  }
];

export const INITIAL_FILTERS: FilterState = {
  minCapacity: 0,
  building: 'All',
  amenities: [],
  onlyAvailableNow: true,
};

export const MOCK_EVENTS: UniEvent[] = [
  {
    id: 'evt1',
    title: 'Tech Giants Career Fair',
    category: EventCategory.CAREER,
    time: 1400,
    location: 'Main Auditorium',
    description: 'Meet recruiters from Google, Microsoft, and Amazon.'
  },
  {
    id: 'evt2',
    title: 'Varsity Basketball Finals',
    category: EventCategory.SPORTS,
    time: 1800,
    location: 'Sports Complex',
    description: 'Support our team against City University.'
  },
  {
    id: 'evt3',
    title: 'AI in 2025: Guest Lecture',
    category: EventCategory.GUEST_LECTURE,
    time: 1100,
    location: 'E-101 Lecture Hall',
    description: 'Dr. Smith discusses the future of Generative AI.'
  },
  {
    id: 'evt4',
    title: 'Freshers Ice Breaker',
    category: EventCategory.SOCIAL,
    time: 1900,
    location: 'Student Union Lawn',
    description: 'Music, food, and games for new students.'
  },
  {
    id: 'evt5',
    title: 'Thesis Submission Deadline',
    category: EventCategory.ACADEMIC,
    time: 2359,
    location: 'Online Portal',
    description: 'Final deadline for senior year thesis submission.'
  }
];