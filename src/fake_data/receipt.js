export const getReceipts = {
    "status": "success",
    "message": "SUCCESS",
    "code": 200,
    "data": {
        "current_page": 0,
        "data": [
            {
                "id": 0,
                "contract_code": "string",
                "type": "promotion",
                "status": "paid",
                "amount": 0,
                "vat": 5000000,
                "vat_rate": 10,
                "service_fee": 5000000,
                "service_fee_rate": 8,
                "payment_date": 0,
                "payment_type": "card",
                "created_at": 0,
                "accountant": {
                    "id": 0,
                    "display_name": "string",
                    "email": "string",
                    "phone": "string"
                }
            }
        ],
        "first_page_url": "string",
        "from": 0,
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
        "per_page": 0,
        "prev_page_url": "string",
        "to": 0,
        "total": 0
    }
}

export const course_lesstions = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: [
        {
            id: 26,
            name: "Hashimoto Hikaru",
            status: "publish",
            instructor: {
                id: 1,
                display_name: "Kobayashi Eita",
                avatar_url:
                    "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833538.jpg?w=740&t=st=1695883386~exp=1695883986~hmac=71f197cb36fb261d294fb6c909884e3cc49456a4580bb81983ea1ba88fb4c0d2",
            },
            start_date: 1695881827000,
            end_date: 1695881827000,
            theory_percent: 21.51,
            practice_percent: 64.71,
            actual_share_percent: 89.28,
        },
        {
            id: 2345,
            name: "Hashimoto Hikaru",
            status: "publish",
            instructor: {
                id: 1,
                display_name: "Kobayashi Eita",
                avatar_url:
                    "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833538.jpg?w=740&t=st=1695883386~exp=1695883986~hmac=71f197cb36fb261d294fb6c909884e3cc49456a4580bb81983ea1ba88fb4c0d2",
            },
            start_date: 1695881827000,
            end_date: 1695881827000,
            theory_percent: 21.51,
            practice_percent: 64.71,
            actual_share_percent: 89.28,
        },
    ],
};

export const course_orders = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: [
        {
            id: 4,
            code: "GsFMiA6Nmm",
            price: 4219005,
            created_at: 1375464152,
            payment_date: 1676281941,
            quantity: "4",
            status: "accepted",
            courses: [
                {
                    id: 1,
                    name: "Wedding planner",
                    type: "google-ads",
                },
                {
                    id: 4,
                    name: "Personal trainer",
                    type: "zalo-ads",
                },
                {
                    id: 5,
                    name: "Retail sales associate",
                    type: "tiktok-ads",
                },
            ],
        },
        {
            id: 345344,
            code: "GsFMiA6Nmm",
            price: 4219005,
            created_at: 1375464152,
            payment_date: 1676281941,
            quantity: "4",
            status: "accepted",
            courses: [
                {
                    id: 1,
                    name: "Wedding planner",
                    type: "google-ads",
                },
                {
                    id: 4,
                    name: "Personal trainer",
                    type: "zalo-ads",
                },
                {
                    id: 5,
                    name: "Retail sales associate",
                    type: "tiktok-ads",
                },
            ],
        },
    ],
};

export const coures_customer = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: [
        {
            id: 2,
            display_name: "Gu Yunxi",
            email: "yunxigu2@yahoo.com",
            phone: "614-495-7671",
            role: "student",
            status: null,
            avatar_url: "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833538.jpg?w=740&t=st=1695883386~exp=1695883986~hmac=71f197cb36fb261d294fb6c909884e3cc49456a4580bb81983ea1ba88fb4c0d2",
            payment_date: null,
            payment_amount: null,
        },
        {
            id: 54762,
            display_name: "Gu Yunxi",
            email: "yunxigu2@yahoo.com",
            phone: "614-495-7671",
            role: "student",
            status: null,
            avatar_url: "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833538.jpg?w=740&t=st=1695883386~exp=1695883986~hmac=71f197cb36fb261d294fb6c909884e3cc49456a4580bb81983ea1ba88fb4c0d2",
            payment_date: null,
            payment_amount: null,
        },
    ],
};

export const course_update_lession = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: [],
};

export const categories = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: [
        {
            id: 2,
            name: "Appliances",
        },
        {
            id: 3,
            name: "Collectibles & Fine Art",
        },
        {
            id: 4,
            name: "Collectibles & Fine Art",
        },
        {
            id: 5,
            name: "Video Games",
        },
        {
            id: 8,
            name: "Apps & Games",
        },
        {
            id: 10,
            name: "Health & Baby Care",
        },
    ],
};

export const topics = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: [
        {
            id: 24,
            course_category_id: 1,
            name: "Lai Sau Man",
            description:
                "All journeys have secret destinations of which the traveler is unaware.",
            theory_percent: 47.8,
            practice_percent: 50.67,
            actual_share_percent: 34.01,
            status: "publish",
            created_at: 1628951746,
            updated_at: 1416854654,
        },
        {
            id: 245644,
            course_category_id: 1,
            name: "Lai Sau Man",
            description:
                "All journeys have secret destinations of which the traveler is unaware.",
            theory_percent: 47.8,
            practice_percent: 50.67,
            actual_share_percent: 34.01,
            status: "publish",
            created_at: 1628951746,
            updated_at: 1416854654,
        },
    ],
};

export const staffs = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: [
        {
            id: 24,
            display_name: "Lai Sau Man",
            specialization: "google-ads",
            zone: "hcm",
            avatar_url: "",
        },
        {
            id: 2434,
            display_name: "Lai Sau Man",
            specialization: "google-ads",
            zone: "hcm",
            avatar_url: "",
        },
        {
            id: 2345,
            display_name: "Lai Sau Man",
            specialization: "google-ads",
            zone: "hcm",
            avatar_url: "",
        },
    ],
};

export const create_success = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: {
        course_id: 16,
    },
};
