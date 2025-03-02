import { Role } from "./chat";

export enum LessonStatus
{
    Proposed,
    Booked,
    Completed,
    Canceled
}
export enum LessonType
{
    Proposition,
    Lesson
}
export interface Lesson {
    recipientRole: Role;
    recipientName: string;
    id: number;
    topic: string; // e.g., "Math Basics"
    date: Date;
    price: number;
    duration: string; // e.g., "1 hour"
    status: LessonStatus; // e.g., "Completed", "Upcoming"
    type: LessonType,
    meetingToken: string;
    meetingDomain: string;
    meetingUrl: string;
    meetingRoomName: string;
    meetingRoomUrl: string;
  }
  