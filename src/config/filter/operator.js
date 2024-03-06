const  operators=
{
    date: 
    [
        {
            name: "Trước ngày",
            operator: '<'
        },
        {
            name: "Trong ngày",
            operator: 'between',
        },
        {
            name: "Sau ngày",
            operator: '>',
        }
    ],

    number: 
    [
        {
            name: "Bé hơn",
            operator: '<'
        },
        {
            name: "Bằng",
            operator: '=',
        },
        {
            name: "Lớn hơn",
            operator: '>',
        }
    ],

    text: 
    [
        {
            name: "Tương đồng",
            operator: 'like'
        },
        {
            name: "Chính xác",
            operator: '=',
        },
    ],
    
    select:
    [
        {
            name: "Chính xác",
            operator: '=',
        },
        {
            name: "Khác",
            operator: '!='
        },
        
    ],
}

export default operators