
const response_message = {
    public: {
        SUCCESS: {
            message: 'Thành công',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Giá trị truyền vào không hợp lệ',
            auth: false
        },
        UNAUTHORIZED: {
            message: 'Không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoảng không hoạt động',
            auth: true
        },
        NOT_FOUND: {
            message: 'Không tìm thấy',
            auth: true
        },
        FORBIDDEN: {
            message: 'Bạn không được phép làm điều này',
            auth: true
        },
        SERVER: {
            message: 'Server bảo trì',
            auth: true
        },
        CONFLICT: {
            message: 'Tính năng đang bảo trì',
            auth: true   
        },
        NO_CONTENT: {
            message: 'Không có dữ liệu phù hợp',
            auth: true   
        }
    },
    change_password: {
        SUCCESS: {
            message: 'Mật khẩu của bạn đã được thay đổi',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Giá trị truyền vào không hợp lệ',
            auth: false
        },
        UNAUTHORIZED: {
            message: 'Không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoản không hoạt động',
            auth: true
        },
        NOT_FOUND: {
            message: 'Mật khẩu cũ không đúng',
            auth: false
        },
        FORBIDDEN: {
            message: 'Bạn không được phép làm điều này',
            auth: true
        },
        SERVER: {
            message: 'Server bảo trì',
            auth: false
        },
        CONFLICT: {
            message: 'Tính năng đang bảo trì',
            auth: true   
        },
        NO_CONTENT: {
            message: 'Không có dữ liệu phù hợp',
            auth: true   
        }
    },
    login_user_pwd: {
        SUCCESS: {
            message: 'Đăng nhập thành công',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Tài khoản hoặc mật khẩu không hợp lệ',
            auth: false
        },
        UNAUTHORIZED: {
            message: 'Bạn không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoản không tồn tại',
            auth: true
        },
        NOT_FOUND: {
            message: 'Tài khoản không tồn tại',
            auth: true
        },
        FORBIDDEN: {
            message: 'Tài khoản bị khóa',
            auth: true
        },
        SERVER: {
            message: 'Server đang bảo trì',
            auth: false,
        },
        WRONG_LOGIN_INFORMATION: {
            message: 'Tài khoản và mật khẩu không hợp lệ',
            auth: true
        }
    },

    permission: {
        SUCCESS: {
            message: 'Láy phân quyền thành công',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Token không hợp lệ',
            auth: true
        },
        UNAUTHORIZED: {
            message: 'Bạn không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoản không hoạt động',
            auth: true
        },
        NOT_FOUND: {
            message: 'Không tìm thấy tài khoản của bạn',
            auth: true
        },
        FORBIDDEN: {
            message: 'Bạn không có quyền truy cập và hệ thống',
            auth: true
        },
        FIREBASE_EXCEPTION: {
            message: 'Thông tin đăng nhập không hợp lệ',
            auth: true
        }
    },

    firebase: {
        SUCCESS: {
            message: 'Đăng nhập thành công',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Tài khoản không hợp lệ',
            auth: true
        },
        UNAUTHORIZED: {
            message: 'Bạn không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoản không hoạt động',
            auth: true
        },
        NOT_FOUND: {
            message: 'Tài khoản của bạn không có trong hệ thống của chúng tôi',
            auth: true
        },
        FORBIDDEN: {
            message: 'Bạn không có quyền truy cập và hệ thống',
            auth: true
        },
        SERVER: {
            message: 'Có lỗi trong quá trình đăng nhập vui lòng thử lại',
            auth: true
        },
        FIREBASE_EXCEPTION: {
            message: 'Thông tin đăng nhập không hợp lệ',
            auth: true
        }
    },

    topic_delete: {
        SUCCESS: {
            message: 'Thành công',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Giá trị truyền vào không hợp lệ',
            auth: false
        },
        UNAUTHORIZED: {
            message: 'Không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoảng không hoạt động',
            auth: true
        },
        NOT_FOUND: {
            message: 'Không tìm thấy',
            auth: true
        },
        FORBIDDEN: {
            message: 'Bạn không được phép làm điều này',
            auth: true
        },
        SERVER: {
            message: 'Server bảo trì',
            auth: true
        },
        CONFLICT: {
            message: 'Tính năng đang bảo trì',
            auth: true   
        },
        NO_CONTENT: {
            message: 'Không có dữ liệu phù hợp',
            auth: true   
        },

    },

    category_delete: {
        SUCCESS: {
            message: 'Thành công',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Không được xóa, giáo trình này đã có chủ đề ',
            auth: false
        },
        UNAUTHORIZED: {
            message: 'Không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoảng không hoạt động',
            auth: true
        },
        NOT_FOUND: {
            message: 'Không tìm thấy',
            auth: true
        },
        FORBIDDEN: {
            message: 'Bạn không được phép làm điều này',
            auth: true
        },
        SERVER: {
            message: 'Server bảo trì',
            auth: true
        },
        CONFLICT: {
            message: 'Tính năng đang bảo trì',
            auth: true   
        },
        NO_CONTENT: {
            message: 'Không có dữ liệu phù hợp',
            auth: true   
        },
        CATEGORY_HAS_COURSE: {
            message: 'Không thể xoá danh mục vì danh mục đã có khoá học',
            auth: false   
        },
        CATEGORY_PUBLISH: {
            message: 'Không thể xoá danh mục vì danh mục đã có khoá học',
            auth: false   
        },

    },
    delete_course: {
        SUCCESS: {
            message: 'Thành công',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Không thể xóa khóa học này',
            auth: false
        },
        UNAUTHORIZED: {
            message: 'Không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoảng không hoạt động',
            auth: true
        },
        NOT_FOUND: {
            message: 'Không tìm thấy',
            auth: true
        },
        FORBIDDEN: {
            message: 'Bạn không được phép làm điều này',
            auth: true
        },
        SERVER: {
            message: 'Server bảo trì',
            auth: true
        },
        CONFLICT: {
            message: 'Tính năng đang bảo trì',
            auth: true   
        },
        NO_CONTENT: {
            message: 'Không có dữ liệu phù hợp',
            auth: true   
        },
        METHOD_NOT_ALLOWED: {
            message: 'Không thể xóa chủ đề này',
            auth: true  
        }

    },


    order_create: {
        SUCCESS: {
            message: 'Thành công',
            auth: false
        },
        INVALID_INPUT: {
            message: 'Giá trị truyền vào không hợp lệ',
            auth: false
        },
        UNAUTHORIZED: {
            message: 'Không có quyền thực hiện',
            auth: true
        },
        NOT_AVAILABLE: {
            message: 'Tài khoảng không hoạt động',
            auth: true
        },
        NOT_FOUND: {
            message: 'Không tìm thấy',
            auth: true
        },
        FORBIDDEN: {
            message: 'Bạn không được phép làm điều này',
            auth: true
        },
        SERVER: {
            message: 'Server bảo trì',
            auth: true
        },
        CONFLICT: {
            message: 'Tính năng đang bảo trì',
            auth: true   
        },
        NO_CONTENT: {
            message: 'Không có dữ liệu phù hợp',
            auth: true   
        },
        CATEGORY_HAS_COURSE: {
            message: 'Không thể xoá danh mục vì danh mục đã có khoá học',
            auth: false   
        },
        CATEGORY_PUBLISH: {
            message: 'Không thể xoá danh mục vì danh mục đã có khoá học',
            auth: false   
        }, 

        CONTACT_EMAIL_EXIST: {
            message: 'Email đã được đăng ký',
            auth: false   
        },
        CONTACT_PHONE_EXIST: {
            message: 'Số điện thoại đã được đăng ký',
            auth: false   
        },
        CONTACT_BELONG_TO_SALE : {
            message: 'Khách hàng này đã thuộc về sale khác của hệ thống',
            auth: false   
        },
    
    },
}


export default response_message