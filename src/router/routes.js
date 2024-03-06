import store from "@/state/store";

export default [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/account/login.vue"),
        meta: {
            title: "Login",
            layout: 'auth',
            permission: 'public',
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({ name: "default" });
                } else {
                    // Continue to the login page
                    next();
                }
            },
        },
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/account/register.vue"),
        meta: {
            title: "Register",
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({ name: "default" });
                } else {
                    // Continue to the login page
                    next();
                }
            },
        },
    },
    {
        path: "/forgot-password",
        name: "Forgot password",
        component: () => import("../views/account/forgot-password.vue"),
        meta: {
            title: "Forgot Password",
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({ name: "default" });
                } else {
                    // Continue to the login page
                    next();
                }
            },
        },
    },
    {
        path: "/logout",
        name: "logout",
        meta: {
            title: "Logout",
            authRequired: true,
            layout: 'auth',
            permission: 'public',
            beforeResolve(routeTo, routeFrom, next) {
                localStorage.clear();
                sessionStorage.clear();
                next();
            },
        },
        component: () => import("../views/auth/logout/basic.vue"),
    },
    {
        path: "/auth/logout-basic",
        name: "logout-basic",
        meta: {
            title: "Logout",
            authRequired: true,
        },
        component: () => import("../views/auth/logout/basic"),
    },
    {
        path: "/",
        name: "loading",
        meta: {
            title: "Loading",
            authRequired: true,
            layout: 'none'
        },
        component: () => import("../views/loading/loading.vue"),
    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: {
            title: "Tổng quan",
            authRequired: true,
            layout: 'main'
        },
        component: () => import("../views/dashboard/dashboard.vue"),
    },
    {
        path: "/profile",
        name: "profile",
        meta: {
            title: "Trang cá nhân",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/profile/profile.vue"),
    },
    {
        path: "/students",
        name: "students",
        meta: {
            title: "Danh sách học viên",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/customer/customer.vue"),
    },
    {
        path: "/students/:id",
        name: "students-detail",
        meta: {
            title: "Thông tin học viên",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/customer/customer-detail.vue"),
    },
    {
        path: "/customers",
        name: "customers",
        meta: {
            title: "Danh sách khách hàng",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/client/clients.vue"),
    },
    {
        path: "/customers/:id",
        name: "customers-detail",
        meta: {
            title: "Thông tin khách hàng",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/client/client-details.vue"),
    },
    {
        path: "/staffs",
        name: "staffs",
        meta: {
            title: "Danh sách nhân viên",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/staff/staff.vue"),
    },
    {
        path: "/staffs/:id",
        name: "staffs-details",
        meta: {
            title: "Thông tin nhân viên",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/staff/staff-detail.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-founde",
        meta: {
            title: "Không tìm thấy",
            authRequired: true,
            layout: 'none',
            permission: 'public'
        },
        component: () => import("../views/auth/errors/404-basic"),
    },
    {
        path: "/courses",
        name: "courses",
        meta: {
            title: "Khóa học",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/course/course-list.vue"),
    },
    {
      
        path: "/orders",
        name: "orders",
        meta: {
            title: "Đặt lịch",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
     
        component: () => import("../views/app/order/order-list.vue"),
    },

    {
      
        path: "/categories",
        name: "categories",
        meta: {
            title: "Danh sách giáo trình",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
     
        component: () => import("../views/app/category/category-list.vue"),

    },
    {
        path: "/categories/:id",
        name: "categories-detail",
        meta: {
            title: "Danh mục",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/category/category-detail.vue"),
    },

    {
        path: "/courses/:id",
        name: "courses-detail",
        meta: {
            title: "Thông tin khóa học",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/course/course-detail.vue"),
    },
    {
        path: "/courses/create",
        name: "courses-create",
        meta: {
            title: "Thêm khóa học",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/course/course-create.vue"),
    },
    {
        path: "/orders/create",
        name: "orders-create",
        meta: {
            title: "Đăng ký khóa học",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/order/order-create.vue"),
    },
    {
        path: "/orders/:id",
        name: "orders-detail",
        meta: {
            title: "Thông tin đặt lịch",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/order/order-detail.vue"),
    },

    {
        path: "/contracts",
        name: "contracts",
        meta: {
            title: "Hợp đồng",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/contract/contract-list.vue"),
    },

    {
        path: "/payments",
        name: "payments",
        meta: {
            title: "Thanh toán",
            authRequired: true,
            layout: 'main',
            permission: 'public'
        },
        component: () => import("../views/app/payment/payment-list.vue"),
    },

];
