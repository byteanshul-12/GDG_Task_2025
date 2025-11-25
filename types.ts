export enum Building {
  ENGINEERING = 'Engineering Block',
  SCIENCE = 'Science Center',
  ARTS = 'Arts & Humanities',
  LIBRARY = 'Central Library'
}

export enum Amenity {
  PROJECTOR = 'Projector',
  WHITEBOARD = 'Whiteboard',
  OUTLETS = 'Power Outlets',
  AC = 'Air Conditioning',
  COMPUTERS = 'Computers',
  QUIET_ZONE = 'Quiet Zone'
}

export interface TimeSlot {
  start: number; // 24h format, e.g., 900 for 9:00 AM
  end: number;   // e.g., 1030 for 10:30 AM
  course?: string;
}

export interface RoomSchedule {
  [dayOfWeek: number]: TimeSlot[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  amenities: Amenity[];
  schedule: RoomSchedule;
  isLocked?: boolean; // Manual override
  imageUrl?: string;
}

export interface FilterState {
  minCapacity: number;
  building: Building | 'All';
  amenities: Amenity[];
  onlyAvailableNow: boolean;
}

export interface AIAnalysisResult {
  filters: Partial<FilterState>;
  reasoning: string;
}

// --- New Types for Notification System ---

export enum EventCategory {
  CAREER = 'Career Fairs',
  GUEST_LECTURE = 'Guest Lectures',
  SPORTS = 'Sports Events',
  ACADEMIC = 'Academic Deadlines',
  SOCIAL = 'Social Gatherings'
}

export interface UniEvent {
  id: string;
  title: string;
  category: EventCategory;
  time: number; // HHMM format
  location: string;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  category: EventCategory;
}