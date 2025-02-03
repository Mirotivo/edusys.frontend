export enum DiplomaStatus
{
    NotSubmitted,
    UnderReview,
    Verified
}
export enum PaymentSchedule
{
    Monthly,
    PerLesson
}

export interface User {
  firstName: string;
  lastName: string;
  address: string;
  dob: string;
  email: string;
  phoneNumber: string;
  skypeId: string;
  hangoutId: string;
  profileVerified: string[]; // An array of verification methods like Email, Mobile
  lessonsCompleted: string; // Could be a duration string like '77h'
  evaluations: number; // The number of evaluations
  profileImagePath: string; // Path or URL to the profile image
  profileImage: File; // Path or URL to the profile image
  recommendationToken: string;
  paymentDetailsAvailable: boolean;
}
export interface CompleteProfile {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
}
