import {get} from "../helpers/api/get-data"
import { customers, customer_detail, customer_invoices, customer_courses , customer_lessions, customer_statistics} from "../fake_data/customer"
import {
    API_GET_STUDENTS,
    API_GET_STUDENT_DETAIL,
    API_GET_STUDENT_INVOICES,
    API_GET_STUDENT_DETAIL_COURSES,
    API_GET_STUDENT_DETAIL_LESSIONS,
    API_GET_STUDENTS_STATISTICS
} from "../config/api"


class Customer {

    static async getCustomers(query)
    {
        const result = await get(API_GET_STUDENTS, 
            {
                authHeader: true, 
                query: query
            }, 
            customers
        
        )
        return result            
    }

    static async getCustomersStatistics()
    {
        const result = await get(API_GET_STUDENTS_STATISTICS, 
            {
                authHeader: true, 
            }, 
            customer_statistics
        
        )
        return result            
    }

    static async getCustomerDetail(id) {
        const replacedEndpoint = API_GET_STUDENT_DETAIL.replace(":id", id);

        const res = await get(replacedEndpoint, {
            authHeader: true,
        },customer_detail)
        
        return res
    }

    static async getCustomerCourses(id) {
        const replacedEndpoint = API_GET_STUDENT_DETAIL_COURSES.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        },customer_courses)
        
        return res
    }
    static async getCustomerLessions(id) {
        const replacedEndpoint = API_GET_STUDENT_DETAIL_LESSIONS.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
        },customer_lessions)
        
        return res
    }

    static async getInvoicesList(id,query) {
        const replacedEndpoint = API_GET_STUDENT_INVOICES.replace(":id", id);
        const res = await get(replacedEndpoint, {
            authHeader: true,
            query: query
        },customer_invoices)
        
        return res
    }

}
export default Customer;