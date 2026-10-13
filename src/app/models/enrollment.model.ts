
export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  courseTitle: string;
  courseCode: string;
  creditHours: number;
  courseStatus: string;
  semester: string;
}

export interface EnrollmentRequest {
  studentId: number;
  courseId: number;
  semester: string;
}
