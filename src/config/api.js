export const API_GET_COURSES = `${process.env.VUE_APP_API_URL}/v1/courses`

export const API_GET_COURSE_STATISTIC = `${process.env.VUE_APP_API_URL}/v1/courses/statistics`
export const API_GET_COURSE_DETAIL = `${process.env.VUE_APP_API_URL}/v1/courses/:id`
export const API_GET_COURSE_DETAIL_STAFFS = `${process.env.VUE_APP_API_URL}/v1/courses/:id/staffs`
export const API_GET_COURSE_DETAIL_ORDERS = `${process.env.VUE_APP_API_URL}/v1/courses/:id/orders`
export const API_GET_COURSE_DETAIL_LESSIONS = `${process.env.VUE_APP_API_URL}/v1/courses/:id/lessions`
export const API_GET_COURSE_DETAIL_STUDENTS = `${process.env.VUE_APP_API_URL}/v1/courses/:id/contacts`
export const API_GET_COURSE_DETAIL_LESSION_UPDATE = `${process.env.VUE_APP_API_URL}/v1/courses/:courseId/lessions/:lessionId`
export const API_GET_COURSES_CATEGORY= `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/:id/courses`
export const API_GET_REPORT_COURSE_STATISTIC= `${process.env.VUE_APP_API_URL}/v1/reports/courses/statistics`



export const API_GET_LESSIONS = `${process.env.VUE_APP_API_URL}/v1/courses/:id/lessions`
export const API_GET_LESSION_UPDATE = `${process.env.VUE_APP_API_URL}/v1/courses/:id_course/lessions/:id_lession`


export const API_GET_CATEGORIES_CREATE = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories`

export const API_GET_STUDENTS = `${process.env.VUE_APP_API_URL}/v1/contacts`
export const API_GET_STUDENT_DETAIL = `${process.env.VUE_APP_API_URL}/v1/contacts/:id`
export const API_GET_STUDENT_INVOICES = `${process.env.VUE_APP_API_URL}/v1/contacts/:id/invoices`
export const API_GET_STUDENTS_STATISTICS = `${process.env.VUE_APP_API_URL}/v1/contacts/statistics`
export const API_GET_STUDENT_DETAIL_COURSES = `${process.env.VUE_APP_API_URL}/v1/contacts/:id/courses`
export const API_GET_STUDENT_DETAIL_LESSIONS = `${process.env.VUE_APP_API_URL}/v1/contacts/:id/lessions`
export const API_GET_CATEGORY_STATISTIC =  `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/:id/statistics`

export const API_GET_STAFFS = `${process.env.VUE_APP_API_URL}/v1/staffs`
export const API_GET_STAFF_DETAIL = `${process.env.VUE_APP_API_URL}/v1/staffs/:id`
export const API_GET_STAFF_LESSIONS = `${process.env.VUE_APP_API_URL}/v1/staffs/:id/lessions`
export const API_GET_STAFF_COURSES = `${process.env.VUE_APP_API_URL}/v1/staffs/:id/courses`
export const API_UPDATE_STAFF_DETAIL_INFO = `${process.env.VUE_APP_API_URL}/v1/staffs/:id/update`
export const API_GET_STAFFS_STATISTICS = `${process.env.VUE_APP_API_URL}/v1/staffs/statistics`


export const API_GET_CATEGORIES = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories`
export const API_GET_CATEGORY = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/`
export const API_UPDATE_CATEGORY = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/`
export const API_REMOVE_CATEGORY = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/`




export const API_GET_ORDERS = `${process.env.VUE_APP_API_URL}/v1/orders`
export const API_GET_ORDER_STATISTIC = `${process.env.VUE_APP_API_URL}/v1/orders/statistics`
export const API_GET_ORDER_DETAIL = `${process.env.VUE_APP_API_URL}/v1/orders/:id`


export const API_CREATE_COURSES = `${process.env.VUE_APP_API_URL}/v1/courses`
export const API_CREATE_COURSES_STARFFS = `${process.env.VUE_APP_API_URL}/v1/courses/staffs`
export const API_CREATE_COURSES_CATEGORIES= `${process.env.VUE_APP_API_URL}/v1/courses/categories`
export const API_CREATE_COURSES_TOPICS= `${process.env.VUE_APP_API_URL}/v1/courses/categories/:id/topics`
export const API_GET_TOPICS = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/:id/topics`
export const API_CREATE_TOPIC = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/:id/topics`
export const API_UPDATE_TOPIC = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/:id/topics/`
export const API_DELETE_TOPIC = `${process.env.VUE_APP_API_URL}/v1/courses/channels/categories/:id/topics/`
export const API_UPDATE_COURSES = `${process.env.VUE_APP_API_URL}/v1/courses/:id`


export const API_LOGIN_USERNAME_PASSWORD = `${process.env.VUE_APP_API_URL}/v1/auth/login`
export const API_LOGIN_FIREBASE = `${process.env.VUE_APP_API_URL}/v1/auth/google`



export const API_CREATE_ORDERS = `${process.env.VUE_APP_API_URL}/v1/orders`

export const API_UPDATE_STATUS_ORDER = `${process.env.VUE_APP_API_URL}/v1/orders/:id/status`















export const API_CHECK_PHONE = `${process.env.VUE_APP_API_URL}/v1/orders/check-contact-phone`
export const API_CHECK_EMAIL = `${process.env.VUE_APP_API_URL}/v1/orders/check-contact-email`

export const API_CHANGE_COURSE_ORDER = `${process.env.VUE_APP_API_URL}/v1/orders/:orderId/courses/:courseId`
export const API_DELETE_COURSE_ORDER = `${process.env.VUE_APP_API_URL}/v1/orders/:orderId/courses/:courseId`


export const API_DELETE_CONTACT_ORDER = `${process.env.VUE_APP_API_URL}/v1/orders/:orderId/courses/:courseId/contacts/:contactId`
export const API_UPDATE_CONTACT_ORDER = `${process.env.VUE_APP_API_URL}/v1/orders/:orderId/courses/:courseId/contacts/:contactId`
export const API_CREATE_CONTACT_ORDER = `${process.env.VUE_APP_API_URL}/v1/orders/:orderId/courses/:courseId/contacts`


export const API_GET_CUSTOMERS = `${process.env.VUE_APP_API_URL}/v1/customers`


export const API_GET_CONTRACT_DETAILS = `${process.env.VUE_APP_API_URL}/v1/contracts/:id`
export const API_GET_CONTRACT_DETAILS_RECEIPTS = `${process.env.VUE_APP_API_URL}/v1/contracts/:id/receipts`






export const API_GET_CONTRACT = `${process.env.VUE_APP_API_URL}/v1/contracts`
export const API_GET_CONTRACT_STATISTIC = `${process.env.VUE_APP_API_URL}/v1/contracts/statistics`


export const API_GET_RECEIPT = `${process.env.VUE_APP_API_URL}/v1/receipts`



export const  API_GET_REPORT_CHART_MAIN = `${process.env.VUE_APP_API_URL}/v1/reports/orders/detail`
export const  API_GET_REPORT_CHART_MAIN_STATISTIC = `${process.env.VUE_APP_API_URL}/v1/reports/orders/statistical`
export const  API_GET_LIST_TOP5_COURSE_REVENUE = `${process.env.VUE_APP_API_URL}/v1/courses/best-selling`

export const API_GET_DATA_CHART_ORDER = `${process.env.VUE_APP_API_URL}/v1/reports/orders/detail`
export const API_GET_DATA_CHART_ORDER_STATISTIC = `${process.env.VUE_APP_API_URL}/v1/reports/orders/statistical`

export const  API_GET_REPORT_DASHBOARD_BOX_OVERVIEW = `${process.env.VUE_APP_API_URL}/v1/reports/orders/statistical`
