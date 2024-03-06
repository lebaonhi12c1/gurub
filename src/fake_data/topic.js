export const getTopics = {
    "status": "success",
    "message": "SUCCESS",
    "code": 200,
    "data": {
        "current_page": "string",
        "data": [
            {
                "id": 0,
                "code": "DH11883867",
                "name": "Chủ đề cơ bản",
                "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                "theory_percent": "30",
                "practice_percent":"70",
                "actual_share_percent":"0",
                "status": "publish",
                "created_at": 1231231230
            },
            {
                "id": 1,
                "code": "DH11883867",
                "name": "Chủ đề nâng cao",
                "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                "theory_percent": "0",
                "practice_percent":"50",
                "actual_share_percent":"50",
                "status": "publish",
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
        count: {
            active: 20,
            total: 30
        },
        method: {
            online : 30,
            offline: 30,
        },
        location: {
            hochiminh: 8,
            hanoi: 5
        }
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