// import {convertDateToTimestamp} from "../../configs/utils"


const config = 
{
    host: 'category',
    sort:
    [
        {
            name: 'code',
            label: 'Mã',
        },
        {
            name: 'name',
            label: 'Tên',
        },
        {
            name: 'total_courses',
            label: 'Số lượng khóa học',
        },
        {
            name: 'total_topics',
            label: 'Số lượng chủ đề',
        },
    ],
    search:
    [
        {
            name: 'code',
            label: 'Mã',
            type: 'text'
        },
        {
            name: 'name',
            label: 'Tên',
            type: 'text'

        },
        {
            name: 'total_courses',
            label: 'Số lượng khóa học',
            type: 'text'

        },
        {
            name: 'total_topics',
            label: 'Số lượng chủ đề',
            type: 'text'

        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select'
        },
    ]
}

export default config