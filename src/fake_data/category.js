export const getCategories = {
    "status": "success",
    "message": "SUCCESS",
    "code": 200,
    "data": {
        "current_page": "string",
        "data": [
            {
                "id": 0,
                "code": "DH11883867",
                "name": "Khóa học nâng cao",
                "total_topics": "20",
                "total_courses": "124",
                "revenue": "1115000000",
                "description": "Mô tả thử",
                "status": "public",
                "created_at": 1231231230
            },
            {
                "id": 1,
                "code": "DH11883867",
                "name": "Khóa học nâng cao",
                "total_topics": "20",
                "total_courses": "124",
                "revenue": "1115000000",
                "employees": [
                    {
                        "id": 0,
                        "display_name": "Lê Bảo Báo",
                        "avatar_url": "https://hips.hearstapps.com/hmg-prod/images/index-avatar-1665421955.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=1200:*"
                    },
                ],
                "status": "draft",
                "created_at": 1231231230
            }
        ],
        "first_page_url": "string",
        "from": 5,
        "last_page": 0,
        "last_page_url": "string",
        "links": [
            {
                "url": "string",
                "label": "string",
                "active": "true"
            }
        ],
        "next_page_url": "string",
        "path": "string",
        "per_page": 25,
        "prev_page_url": "string",
        "to": 25,
        "total": 125
    }
}

export const getCategoryStatistic = {
    "status": "success",
    "message": "SUCCESS",
    "code": 200,
    "data": {
        "total_courses" : 10,
        "total_courses_publish" : 5,
        "total_method_online" : 10,
        "total_method_offline" : 10,
        "total_zone_hcm" : 10,
        "total_topics" : 10,
        }
}

export const create = {
    "status": "success",
    "message": "SUCCESS",
    "code": 200,
    "data": {
        "id": 1,
        "name": 'string',
    }
}


export const getCategoryDetail = {
    "status": "success",
    "message": "SUCCESS",
    "code": 200,
    "data": {
        "id":1,
        "code":"aVVt7mtOll",
        "status":"draft",
        "name":"Collectibles & Fine Art asdfasdfas klasdfjklasjdlfk;jalskdf",
        "created_at": 1006588967,
        "updated_at": 1556987644,
        "description": "In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram"
    }
}