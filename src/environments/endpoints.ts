
export const ENDPOINTS = {
   students:{
    getAllStudents:'/api/students',
   //  createStudents:'/api/students',
   //  updateStudent:'/api/students/:id',
    deleteStudent:'/api/students/:id',
    getStudentById:'/api/students/:id',
    getMyRecord:'/api/students/me',
     searchByName: '/api/students/search',
   uploadPhoto:'/api/students/upload-photo'
    
   },

   courses:{
      getAllCourses:'/api/courses',
      getCourseById:'/api/courses/:id',
      createCourse:'/api/courses',
      updateCourse:'/api/courses/:id',
      deleteCourse:'/api/courses/:id',
      

   },

   fee:{
       getAllFees: '/api/fee',
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
   },

    auth:{                                       
      login:'/api/auth/login',
      signup:'/api/auth/signup',
      changePassword:'/api/auth/change-password',
      forgotPassword:'/api/auth/forgot-password',
      resetPassword:'/api/auth/reset-password',
   }

};
 