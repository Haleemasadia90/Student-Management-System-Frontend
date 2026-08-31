
export const ENDPOINTS = {
   students:{
    getAllStudents:'/api/students',
   //  createStudents:'/api/students',
   //  updateStudent:'/api/students/:id',
    deleteStudent:'/api/students/:id',
    getStudentById:'/api/students/:id',
    getMyRecord:'/api/students/me'
    
   },

   courses:{
      getAllCourses:'/api/courses',
      getCourseById:'/api/courses/:id',
      createCourse:'/api/courses',
      updateCourse:'/api/courses/:id',
      deleteCourse:'/api/courses/:id',
      

   },

   fee:{
       getAllFees: '/fees',
      createFee: '/api/fee/:studentId',
      getFeesByStudentId: '/api/fee/student/:studentId',
      getMyFees:'/api/fee/me',
      updateFee:'/api/fee/:feeId',
      deleteFee:'/api/fee/:feeId'
   },

   department:{
      getAllDepartments:'/api/departments',
      createDepartment:'/api/departments',
      deleteDepartments:'/api/departments/:id'
   }
};
 