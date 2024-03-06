export default {
    host: 'course_detail_order_list',
    sort:[
        {
            name: 'id',
            label: 'Mã đơn'
        },
        {
            name: 'quantity',
            label: 'Số lượng học viên'
        },
        {
            name: 'courses',
            label: 'Khóa học'
        },
        {
            name: 'price',
            label: 'Giá trị đơn',
        },
        {
            name: 'created_at',
            label: 'Ngày lập đơn',
        },
        {
            name: 'payment_date',
            label: 'Ngày thanh toán',
        },
        {
            name: 'status',
            label: 'Trạng thái'
        },
    ],

    search: [
        {
            name: 'id',
            label: 'Mã đơn',
            type: 'text',
        },
        {
            name: 'quantity',
            label: 'Số lượng học viên',
            type: 'text',
        },
        {
            name: 'courses_name',
            label: 'Khóa học',
            type: 'text',
        },
        {
            name: 'price',
            label: 'Giá trị đơn',
            type: 'text',
        },
        {
            name: 'created_at',
            label: 'Ngày lập đơn',
            type: 'date',
        },
        {
            name: 'payment_date',
            label: 'Ngày thanh toán',
            type: 'date',
        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select',
        },
    ]
}