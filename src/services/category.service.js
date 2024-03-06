import {get, post, put, remove} from "../helpers/api/get-data"
import {getCategories, getCategoryStatistic, create, getCategoryDetail} from "../fake_data/category"
import {
    API_GET_CATEGORY,
    API_GET_CATEGORIES,
    API_GET_CATEGORY_STATISTIC,
    API_GET_CATEGORIES_CREATE,
    API_UPDATE_CATEGORY,
    API_REMOVE_CATEGORY
} from "../config/api"


class CategoryService {
 

    static async getCategories(query)
    {
        const result = await get(API_GET_CATEGORIES, 
            {
                authHeader: true, 
                query: query
            }, 
            getCategories
        
        )
        return result            
    }

    static async getstatistic(id)
    {

        const API_TEMP = API_GET_CATEGORY_STATISTIC.replace(":id", id)
        const result = await get(API_TEMP, 
            {
                authHeader: true, 
            }, 
            getCategoryStatistic
        
        )
        return result            
    }

    static async createCategory(data) {
        const result = await post(API_GET_CATEGORIES_CREATE,
            data, 
            {
                authHeader: true, 
            },
            create
        )
        return result
    }
    
    static async getCategory(id)
    {

        const result = await get(API_GET_CATEGORY + id, 
            {
                authHeader: true, 
            }, 
            getCategoryDetail
        
        )
        return  result          
    }
    
    static async updateCategory(data, id) {
        const result = await put(API_UPDATE_CATEGORY+id, 
            data, 
            {
                authHeader: true, 
            },
            create,
            "Cập nhật chủ đề thành công"
        )
        return result
    }

    static async removeCategory(id) {
        const result = await remove(API_REMOVE_CATEGORY+id,
            {
                authHeader: true, 
            },
            create,
            "Xóa danh mục thành công",
            'category_delete'
        )
        return result
    }
}
export default CategoryService;