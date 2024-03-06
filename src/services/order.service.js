import {get, put, remove, post} from "../helpers/api/get-data"
import {getOrders, getCourseStatistic} from "../fake_data/order"
import {
    API_GET_ORDERS,
    API_GET_ORDER_STATISTIC,
    API_GET_ORDER_DETAIL,
    API_CHANGE_COURSE_ORDER,
    API_DELETE_COURSE_ORDER,
    API_CREATE_CONTACT_ORDER,
    API_DELETE_CONTACT_ORDER,
    API_UPDATE_CONTACT_ORDER,



    API_CREATE_ORDERS,
    API_CHECK_EMAIL,
    API_CHECK_PHONE,
    API_UPDATE_STATUS_ORDER,

} from "../config/api"


class OrderService {
 

    static async getOrders(query)
    {
        const result = await get(API_CREATE_ORDERS, 
            {
                authHeader: true, 
                query: query
            }, 
            getOrders
        
        )
        return result            
    }


    static async getstatistic()
    {
        const result = await get(API_GET_ORDER_STATISTIC, 
            {
                authHeader: true, 
            }, 
            getCourseStatistic
        
        )
        return result    
    }


    static async getOrderDetail(id)
    {
        const url = API_GET_ORDER_DETAIL.replace(':id', id)
        const result = await get(url, 
            {
                authHeader: true, 
            }, 
            getOrders
        
        )
        return result            
    }



















    static async createOrder(data)
    {
        const result = await post(API_GET_ORDERS, data, 
            {
                authHeader: true, 
            }, 
            getOrders
        
        )
        return result            
    }

    static async checkEmail(payload) {
        const result = await post(API_CHECK_EMAIL, payload, 
            {
                authHeader: true, 
            }, 
            {},'Thành công','order_create',false, false
        )
        return result
    }

    static async checkPhone(payload) {
        const result = await post(API_CHECK_PHONE, payload, 
            {
                authHeader: true, 
            }, 
            {},'Thành công','order_create',false, false
        )
        return result
    }





















































    static async changeCourse(group_id, payload)
    {
        const url = API_CHANGE_COURSE_ORDER.replace(':orderId', group_id.orderId)
        const endpoint = url.replace(':courseId', group_id.courseId)

        const result = await put(endpoint, payload,
            {
                authHeader: true, 
            }, 
            getOrders
        
        )
        return result            
    }

    static async removeCourse(group_id)
    {
        const url = API_DELETE_COURSE_ORDER.replace(':orderId', group_id.orderId)
        const endpoint = url.replace(':courseId', group_id.courseId)

        const result = await remove(endpoint,
            {
                authHeader: true, 
            }, 
            getOrders
        
        )
        return result            
    }

    static async addContact(group_id, payload)
    {
        var url = API_CREATE_CONTACT_ORDER
        var replacements = {
            ":orderId": group_id.orderId,
            ":courseId": group_id.courseId,
        };
          
        for (const param in replacements) {
             url = url.replace(param, replacements[param]);
        }
          
        const result = await post(url, payload,
            {
                authHeader: true, 
            }, 
            getOrders
        
        )
        return result            
    }

    static async updateContact(group_id, payload)
    {
        var url = API_UPDATE_CONTACT_ORDER
        var replacements = {
            ":orderId": group_id.orderId,
            ":courseId": group_id.courseId,
            ":contactId": group_id.contactId,
          };
          
        for (const param in replacements) {
             url = url.replace(param, replacements[param]);
        }
          
        const result = await put(url, payload,
            {
                authHeader: true, 
            }, 
            getOrders
        
        )
        return result            
    }


    static async removeContact(group_id)
    {
        var url = API_DELETE_CONTACT_ORDER
        const replacements = {
            ":orderId": group_id.orderId,
            ":courseId": group_id.courseId,
            ":contactId": group_id.contactId,
          };
          
        for (const param in replacements) {
             url = url.replace(param, replacements[param]);
        }
          
        const result = await remove(url,
            {
                authHeader: true, 
            }, 
            getOrders
        
        )
        return result            
    }


    static async updateStatusOrder(id,body){
        const res = await put(API_UPDATE_STATUS_ORDER.replace(':id', id), body, {
            authHeader: true
        }, {})
        return res
    }


}
export default OrderService;