
  export interface Listing {
    id: number; //  | null
    tutorId: string;
    tutorName: string;
    contactedCount: number;
    reviews: number;
    lessonCategory: string | null;
    lessonCategoryId: number | null;
    title: string;
    listingImagePath: string; //  | null
    listingImage: File | null;
    locations: string[];
    aboutLesson: string;
    aboutYou: string;
    rates: {
      hourly: number;
      fiveHours: number;
      tenHours: number;
    };
    socialPlatforms: string[];
  }
  