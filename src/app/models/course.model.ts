export interface Course{
    id:number,
    title:string,
    description:string,
    courseCode:string,
    creditHours:string,
    status:string,
    departmentId: number;
  departmentName: string;
}

export interface CourseRequest {
  title: string;
  description: string;
  courseCode: string;
  creditHours: number;
  status: string;
  departmentId: number;
}