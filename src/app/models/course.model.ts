export interface Course{
    id:number,
    title:string,
    description:string,
    courseCode:string,
    creditHours:string,
    status:string
}

export interface CourseRequest {
  title: string;
  description: string;
  courseCode: string;
  creditHours: number;
  status: string;
}