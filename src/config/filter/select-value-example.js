


const contract_select_values =
{
    status:
    [
        {
            value: 'draft',
            label: 'Đang soạn',
            class: 'dark'
        },
        
        {
            value: 'unverified',
            label: 'Chưa cấp số',
            class: 'primary'
        },
        
        {
            value: 'waitingfopprove:',
            label: 'Cấp số',
            class: 'warning'
        },
        
        {
            value: 'pending',
            label: 'Ngưng hoạt động',
            class: 'dark'
        },
        
        {
            value: 'publish',
            label: 'Đang thực hiện',
            class: 'info'
        },
        
        {
            value: 'ending',
            label: 'Đã kết thúc',
            class: 'success'
        },
        
        {
            value: 'liquidation',
            label: 'Thanh lý',
            class: 'secondary'
        },
        
        {
            value: 'remove',
            label: 'Hủy bỏ',
            class: 'danger'
        },
    ],
    type:
    [
        {
            label: 'Google Ads',
            value: 'google-ads',
            class: 'danger'
        },
        {
            label: 'Tiktok Ads',
            value: 'tiktok-ads',
            class: 'dark'
        },
        {
            label: 'Facebook Ads',
            value: 'facebook-ads',
            class: 'info',
        },
        {
            label: 'Zalo Ads',
            value: 'zalo-ads',
            class: 'info',
        },
    ]
}



export {contract_select_values}
