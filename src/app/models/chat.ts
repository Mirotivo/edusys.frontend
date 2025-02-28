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
    profileImagePath: string;
    lastMessage: string;
    timestamp: Date;
    details: string;
    messages: Message[];
    requestDetails: string;
    myRole: Role;
  }

  
export interface Message {
    sentBy: 'me' | 'contact';
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date | 'N/A';
  }
  