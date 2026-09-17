
export const ENDPOINTS = {
   students:{
    getAllStudents:'/api/students',
    deleteStudent:'/api/students/:id',
    getStudentById:'/api/students/:id',
    getMyRecord:'/api/students/me',
     searchByName: '/api/students/search',
   uploadPhoto:'/api/students/upload-photo',
   updateProfile: '/api/students/update-profile',
     getTotalStudents: '/api/students/count',
    
   },

   courses:{
      getAllCourses:'/api/courses',
      getCourseById:'/api/courses/:id',
      createCourse:'/api/courses',
      updateCourse:'/api/courses/:id',
      deleteCourse:'/api/courses/:id',
       getTotalCourses: '/api/courses/count', 
      

   },

   fee:{
       getAllFees: '/api/fee',
      createFee: '/api/fee/:studentId',
      getFeesByStudentId: '/api/fee/student/:studentId',
      getMyFees:'/api/fee/me',
      updateFee:'/api/fee/:feeId',
      deleteFee:'/api/fee/:feeId',
      getMyFeeSummary:'/api/fee/me/summary',   // for student module
      getFeeSummaryByStudentId: '/api/fee/student/:studentId/summary', // for admin module
      getAvailableSemesters:'/api/fee/student/:studentId/available-semesters',
       getOverallFeeSummary: '/api/fee/summary',
   },
      

   department:{
      getAllDepartments:'/api/departments',
      createDepartment:'/api/departments',
      deleteDepartments:'/api/departments/:id',
       getTotalDepartments: '/api/departments/count',
   },

    auth:{                                       
      login:'/api/auth/login',
      signup:'/api/auth/signup',
      changePassword:'/api/auth/change-password',
      forgotPassword:'/api/auth/forgot-password',
      resetPassword:'/api/auth/reset-password',
   }

};
 