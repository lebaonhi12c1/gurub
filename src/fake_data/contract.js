export const getContract = {
    "status": "success",
    "message": "SUCCESS",
    "code": 200,
    "data": {
        "current_page": 0,
        "data": [
            {
                "id": 0,
                "code": "string",
                "vat": 0,
                "status": "waitingforapprove",
                "order": {
                    "id": 0,
                    "code": "string"
                },
                "staff_business": {
                    "id": 0,
                    "display_name": "string",
                    "avatar_url": "string"
                },
                "contract_value": 0,
                "contract_begin": 0,
                "contract_end": 0,
                "created_at": 0,
                "updated_at": 0
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

export const getCourseStatistic = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: {
        count: {
            active: 20,
            total: 30,
        },
        method: {
            online: 30,
            offline: 30,
        },
        location: {
            hochiminh: 8,
            hanoi: 5,
        },
    },
};

export const course_detail = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: {
        id: 1,
        course_category_id: 8,
        name: "Nurse",
        method: "online",
        original_price: "8599483.02",
        discounted_price: "7343680.43",
        sale_price: "0.00",
        unit: "person",
        capacity: 40,
        enrollment: 15,
        start_date: 1351958694,
        end_date: 1316014300,
        start_time: 1695693600,
        end_time: 1695704400,
        level: "basic",
        zone: "Manchester",
        code: "zDECsfnY6m",
        status: "publish",
        stage: "ended",
        description:
            "Navicat Monitor requires a repository to store alerts and metrics for historical analysis. Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab.",
        created_at: 1116761036,
        updated_at: 1614161226,
        deleted_at: null,
        type: "facebook-ads",
    },
};

export const coures_instructors = {
    status: "success",
    message: "SUCCESS",
    code: 200,
    data: [
        {
            id: 3,
            display_name: "Wu Yuning",
            email: "wuyuning8@mail.com",
            phone: "330-565-4970",
            role: "instructor",
            avatar_url: "http://image.sullivan7.info/BaggageTravelEquipment",
        },
        {
            id: 4,
            display_name: "Wu Yuning",
            email: "wuyuning8@mail.com",
            phone: "330-565-4970",
            role: "instructor",
            avatar_url: "http://image.sullivan7.info/BaggageTravelEquipment",
        },
    ],
};

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
