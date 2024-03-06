import moment from "moment";

export const preset_dates = [
    {
        label: '7 ngày gần nhất', 
        range: [
            moment().subtract(7, 'day').startOf('day').toDate(), 
            moment().endOf('day').toDate(), 
        ]
    },
    {
        label: 'Tuần này', 
        range: [
            moment().startOf('isoWeek').toDate(), 
            moment().endOf('day').toDate(), 
        ]
    },
    {
        label: 'Tháng này', 
        range: [
            moment().startOf('month').toDate(), 
            moment().endOf('month').toDate(), 
        ]
    },
    {
        label: 'Tháng trước', 
        range: [
            moment().subtract(1, 'month').startOf('month').toDate(), 
            moment().subtract(1, 'month').endOf('month').toDate(), 
        ]
    },
    {
        label: 'Quý này', 
        range: [
            moment().startOf('quarter').toDate(), 
            moment().endOf('quarter').toDate(), 
        ]
    },
    {
        label: 'Quý trước', 
        range: [
            moment().subtract(1, 'quarter').startOf('quarter').toDate(), 
            moment().subtract(1, 'quarter').endOf('quarter').toDate(), 
        ]
    },
    { 
        label: 'Năm nay', 
        range: [
            moment().startOf('year').toDate(), 
            moment().endOf('year').toDate(), 
        ]
    },
    { 
        label: 'Năm trước', 
        range: [
            moment().subtract(1, 'year').startOf('year').toDate(), 
            moment().subtract(1, 'year').endOf('year').toDate(), 
        ]
    },
]

export const day_label = {
    '0': 'T2',
    '1': 'T3',
    '2': 'T4',
    '3': 'T5',
    '4': 'T6',
    '5': 'T7',
    '6': 'CN',
}