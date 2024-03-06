
import {get, post, put, remove} from "../helpers/api/get-data"
import {categories, coures_customer, coures_instructors, course_detail, course_lesstions, course_orders, course_update_lession, create_success, getCourses, 
    getCourseStatistic, 
    staffs, 
    topics,
    course_quantity_report
} from "../fake_data/course"
import {
    API_GET_COURSES,
    API_GET_COURSE_STATISTIC,
    API_GET_REPORT_COURSE_STATISTIC,
    API_CREATE_COURSES_CATEGORIES,
    API_CREATE_COURSES_TOPICS,
    API_CREATE_COURSES_STARFFS,
    API_CREATE_COURSES,
    API_GET_COURSE_DETAIL,
    API_GET_COURSE_DETAIL_LESSIONS,
    API_GET_COURSE_DETAIL_LESSION_UPDATE,
    API_GET_COURSE_DETAIL_STAFFS,
    API_GET_COURSE_DETAIL_ORDERS,
    API_GET_COURSE_DETAIL_STUDENTS,
    API_GET_COURSES_CATEGORY,
    API_UPDATE_COURSES,
} from "../config/api"


class CourseService {
 

    static async getCourses(query)
    {
        const result = await get(API_GET_COURSES, 
            {
                authHeader: true, 
                query: query
            }, 
            getCourses
        
        )
        return result            
    }

    static async getstatistic()
    {
        const result = await get(API_GET_COURSE_STATISTIC, 
            {
                authHeader: true, 
            }, 
            getCourseStatistic
        
        )
        return result            
    }

    static async getReportQuantityCourse(query)
    {
        const result = await get(API_GET_REPORT_COURSE_STATISTIC, 
            {
                authHeader: true, 
                query: query
            }, 
            course_quantity_report
        
        )
        return result   
    }







    static async getCourseDetail(id) {
        const replacedEndpoint = API_GET_COURSE_DETAIL.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        }, course_detail)
        return res
    }

    static async getCourseDetailLessons(id) {
        const replacedEndpoint = API_GET_COURSE_DETAIL_LESSIONS.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        }, course_lesstions)
        return res
    }

    static async getCourseDetailLessonsUpdate(couresId, lessionId, data) {
        const replacedEndpoint = API_GET_COURSE_DETAIL_LESSION_UPDATE.replace(":courseId", couresId).replace(":lessionId", lessionId);
        const res = await put(replacedEndpoint, data, {
            authHeader: true,
        }, course_update_lession)

        return res
    }

    static async getCourseDetailStaffs(id) {
        const replacedEndpoint = API_GET_COURSE_DETAIL_STAFFS.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        }, coures_instructors)
        return res
    }

    static async getCourseDetailOrders(id) {
        const replacedEndpoint = API_GET_COURSE_DETAIL_ORDERS.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        }, course_orders)
        return res
    }

    static async getCourseDetailCustomers(id) {
        const replacedEndpoint = API_GET_COURSE_DETAIL_STUDENTS.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        }, coures_customer, 'Server bảo trì', 'public',false)
        return res
    }

    static async getCategories(){
        const result = await get(API_CREATE_COURSES_CATEGORIES, 
            {
                authHeader: true, 
            }, 
            categories
        
        )
        return result  
    }
    static async getCategoriesTopics(id){
        const endpoint = API_CREATE_COURSES_TOPICS.replace(":id", id);
        const result = await get(endpoint, 
            {
                authHeader: true, 
            }, 
            topics
        )
        return result  
    }
    static async getStaffs(){

        const result = await get(API_CREATE_COURSES_STARFFS,
            {
                authHeader: true, 
            }, 
            staffs
        )
        return result  
    }

    static async createCourse(data){
        const result = await post(API_CREATE_COURSES, data, 
            {
                authHeader: true, 
            }, 
            create_success
        )
        return result
    }

    static async getCoursesCategory(id)
    {
        const url = API_GET_COURSES_CATEGORY.replace(":id", id);
        const result = await get(url, 
            {
                authHeader: true, 
            }, 
            getCourses
        
        )
        return result            
    }

    static async removeCourse(id)
    {
        const result = await remove(
            API_GET_COURSES + "/"+id
            , 
            {
                authHeader: true, 
            }, 
            getCourses,
            "Xóa khóa học thành công",
            "delete_course"
        )
        return result
    }

    static async updateCourse(id, data)
    {
        const url = API_UPDATE_COURSES.replace(":id", id)
        const result = await put(url, data, 
            {
                authHeader: true, 
            }, 
            create_success
        )
        return result
    }
}
export default CourseService;