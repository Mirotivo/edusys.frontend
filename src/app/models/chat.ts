import { Message } from "./message";

export enum Role
{
    None = 0,
    Student = 1,
    Tutor = 2
}

export interface Chat {
    id: number;
    listingId: number;
    studentId: string;
    recipientId: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    details: string;
    messages: Message[];
    requestDetails: string;
    myRole: Role;
  }
  