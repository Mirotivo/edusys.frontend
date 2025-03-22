import { LessonStatus } from "./enums/lesson-status";
import { LessonType } from "./enums/lesson-type";

export interface LessonFilter {
    recipientName?: string;
    topic?: string;
    startDate?: Date;
    endDate?: Date;
    minPrice?: number;
    maxPrice?: number;
    status?: LessonStatus;
    type?: LessonType;
}
