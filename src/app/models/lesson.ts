export enum LessonStatus
{
    Proposed,
    Booked,
    Completed,
    Canceled
}
export interface Lesson {
    id: number;
    topic: string; // e.g., "Math Basics"
    date: string; // ISO date string
    price: number;
    duration: string; // e.g., "1 hour"
    status: LessonStatus; // e.g., "Completed", "Upcoming"
    meetingToken: string;
    meetingDomain: string;
    meetingUrl: string;
    meetingRoomName: string;
    meetingRoomUrl: string;
  }
  