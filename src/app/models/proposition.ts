export interface Proposition {
    // id: number;
    date: Date;
    duration: number; // "HH:mm:ss" format for TimeSpan
    price: number; // e.g., 30.00
    listingId: number;
    studentId: string | null;
  }
  