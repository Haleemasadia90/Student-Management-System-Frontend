export interface Student {
  id: number;
   fullName?: string;   
  phone?: string;   
  username: string;
  email: string;
  department: string;
  departmentId: number;
  courseTitles: string[];
  totalCreditHours: number;
  maxCreditHours: number;
  profilePicture?: string | null;
  admissionYear?: number;   
  currentSemester?: string;
  currentSemesterNumber?: number;
  totalSemesters?: number;
    enrolledCoursesCount?: number;
  availableCoursesCount?: number;
}