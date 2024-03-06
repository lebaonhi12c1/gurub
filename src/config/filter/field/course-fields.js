// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'course',
    sort:
    [
        {
            name: 'code',
            label: 'Mã khóa học',
        },
        {
            name: 'name',
            label: 'Tên khóa học',
        },
        {
            name: 'level',
            label: 'Mức độ',
        },
        {
            name: 'zone',
            label: 'Địa điểm',
        },
        {
            name: 'method',
            label: 'Hình thức',
        },
        {
            name: 'original_price',
            label: 'Giá gốc',
        },
        {
            name: 'discounted_price',
            label: 'Giá đã giảm',
        },
        {
            name: 'start_date',
            label: 'Ngày khai giảng',
        },
        {
            name: 'end_date',
            label: 'Ngày kết thúc',
        },
        {
            name: 'status',
            label: 'Trạng thái',
        },
        {
            name: 'stage',
            label: 'Tình trạng',
        },
        {
            name: 'created_at',
            label: 'Ngày tạo',
        },
    ],
    search:
    [
        {
            name: 'code',
            label: 'Mã khóa học',
            type: 'text',
        },
        {
            name: 'name',
            label: 'Tên khóa học',
            type: 'text'

        },
        {
            name: 'level',
            label: 'Mức độ',
            type: 'select'

        },
        
        {
            name: 'original_price',
            label: 'Giá gốc',
            type: 'number'

        },

        {
            name: 'discounted_price',
            label: 'Giá đã giảm',
            type: 'number'

        },
        {
            name: 'instructor_display_name',
            label: 'Giảng viên',
            type: 'text'

        },

        {
            name: 'start_date',
            label: 'Ngày khai giảng',
            type: 'date'

        },

        {
            name: 'end_date',
            label: 'Ngày kết thúc',
            type: 'date'

        },

        {
            name: 'zone',
            label: 'Địa điểm',
            type: 'select'

        },

        {
            name: 'type',
            label: 'Loại khóa học',
            type: 'select'

        },

        {
            name: 'method',
            label: 'Hình thức',
            type: 'select'

        },

        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select'
        },
        {
            name: 'stage',
            label: 'Tình trạng',
            type: 'select'
        },
    ]
}

export default config