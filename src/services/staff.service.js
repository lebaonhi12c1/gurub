import {get, put} from "../helpers/api/get-data"
import  staffs, {staff_detail, update_success, staff_lessions, staff_courses}  from "../fake_data/staff"
import {
    API_GET_STAFFS,
    API_GET_STAFF_DETAIL,
    API_UPDATE_STAFF_DETAIL_INFO,
    API_GET_STAFF_COURSES,
    API_GET_STAFF_LESSIONS,
    API_GET_STAFFS_STATISTICS
} from "../config/api"


class Staff {

    static async getStaff(query)
    {
        const result = await get(API_GET_STAFFS, 
            {
                authHeader: true, 
                query: query
            }, 
            staffs
        
        )
        return result            
    }

    static async getStaffDetail(id) {
        const replacedEndpoint = API_GET_STAFF_DETAIL.replace(":id", id);

        const res = await get(replacedEndpoint, {
            authHeader: true,
        },staff_detail)
        
        return res
    }

    static async getStaffLessons(id) {
        const replacedEndpoint = API_GET_STAFF_LESSIONS.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        },staff_lessions)
        
        return res
    }

    static async getStaffCourses(id) {
        const replacedEndpoint = API_GET_STAFF_COURSES.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        },staff_courses)
        
        return res
    }

    static async updateStaffInfo(id,data) {
        const replacedEndpoint = API_UPDATE_STAFF_DETAIL_INFO.replace(":id", id);

        const res = await put(replacedEndpoint, data, {
            authHeader: true,
        },update_success)
        
        return res
    }

    static async getStaffStatistics()
    {
        const result = await get(API_GET_STAFFS_STATISTICS, 
            {
                authHeader: true, 
            }, 
            {}
        )
        return result            
    }
}
export default Staff;