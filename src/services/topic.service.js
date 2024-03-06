import {get, post, put, remove} from "../helpers/api/get-data"
import {getTopics, create, } from "../fake_data/topic"
import {
    API_GET_TOPICS,
    API_CREATE_TOPIC,
    API_DELETE_TOPIC,
    API_UPDATE_TOPIC
} from "../config/api"


class TopicService {


    static async getTopics(id,query)
    {

        let TEMP_API_GET_TOPICS = String(API_GET_TOPICS).replace(":id", id);
        const result = await get(TEMP_API_GET_TOPICS, 
            {
                authHeader: true, 
                query: query
            }, 
            getTopics
        
        )
        return result            
    }

    static async createTopic(id,data) {
        const url = API_CREATE_TOPIC.replace(":id", id)
        const result = await post(url,
            data, 
            {
                authHeader: true, 
            },
            create,
            "Thêm chủ đề thành công"
        )
        return result
    }

    static async updateTopic(data, id, topic_id) {
        let temp_url=String(API_UPDATE_TOPIC).replace(":id", id)
        const result = await put(temp_url+topic_id,
            data, 
            {
                authHeader: true, 
            },
            create,
            "Cập nhật chủ đề thành công"
        )
        return result
    }
    
    static async removeTopic(id, topic_id) {
        let temp_url=String(API_DELETE_TOPIC).replace(":id", id)
        const result = await remove(temp_url+topic_id,
            {
                authHeader: true, 
            },
            create,
            "Xóa chủ đề thành công",
            'topic_delete'
        )
        return result
    }
}
export default TopicService;