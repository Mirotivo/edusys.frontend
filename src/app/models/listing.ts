
  export interface Listing {
    id: number;
    tutorId: string;
    name: string;
    contactedCount: number;
    reviews: number;
    lessonCategory: string;
    lessonCategoryId: number | null;
    category: string;
    title: string;
    listingImagePath: string;
    listingImage: File;
    location: string;
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
  