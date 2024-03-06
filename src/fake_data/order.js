export const getOrders = {
    "status": "success",
    "message": "SUCCESS",
    "code": 200,
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "code": "ORD-1696992271",
                "representative": {
                    "id": 142858,
                    "display_name": "test3",
                    "avatar_url": ""
                },
                "created_by": {
                    "id": 142857,
                    "display_name": "Administrator",
                    "avatar_url": ""
                },
                "quantity": 3,
                "price": 7500000,
                "created_at": 1696992271,
                "payment_date": null,
                "status": "pending",
                "approved_by": null
            }
        ],
        "first_page_url": "http://localhost:8000/v1/orders?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://localhost:8000/v1/orders?page=1",
        "links": [
            {
                "url": null,
                "label": "pagination.previous",
                "active": false
            },
            {
                "url": "http://localhost:8000/v1/orders?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "pagination.next",
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://localhost:8000/v1/orders",
        "per_page": 25,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
}