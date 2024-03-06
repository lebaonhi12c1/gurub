<script>

import { dimensions } from "../../../config/dimensions";
import { dashboardComputed } from '../../../state/helpers'
import PlaceholderWraper from '../../../components/ui/placeholder-wraper.vue';
import moment from 'moment';
import 'moment/locale/vi';

import {
    CountTo
} from "vue3-count-to";
import _get from 'lodash/get'


import { getData, changeLabelChart } from "../../../helpers/utils";
import DashboardService from "../../../services/dashboard.service";
import get from "lodash/get";


function getChartColorsArray(colors) {
    colors = JSON.parse(colors);
    return colors.map(function (value) {
        var newValue = value.replace(" ", "");
        if (newValue.indexOf(",") === -1) {
            var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
            if (color) {
                color = color.replace(" ", "");
                return color;
            } else return newValue;
        } else {
            var val = value.split(',');
            if (val.length == 2) {
                var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                return rgbaColor;
            } else {
                return newValue;
            }
        }
    });
}
export default {
    components: {
        CountTo,
        PlaceholderWraper
    },
    data() {
        return {
            moment,
            series: [{
                name: "Số lượng học viên",
                type: "area",
                // data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
                data:[]
            },],
            dataStatistic: {},
            // series: [],
            chartOptions: {
                noData: {
                    text: 'Không có dữ liệu thống kê!!!',
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: -10,
                    style: {
                        zIndex:10,
                        margin: '-12px 0 0 0 ',
                        color: '#FA896B',
                        fontSize: '14px',
                        fontFamily: undefined
                    }
                },
                chart: {
                    type: "area",
                    toolbar: {
                        show: false,
                    },
                    height: '100%',
                    
                },
                stroke: {
                    curve: 'smooth',
                    dashArray: [0, 0, 8],
                    width: [3, 0, 2.2],
                },
                fill: {
                    opacity: [0.1, 0.9, 1],
                },
                markers: {
                    size: [0, 0, 0],
                    strokeWidth: 6,
                    hover: {
                        size: 6,
                    },
                },
                yaxis: [
                {
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#fa896b'
                    },
                    labels: {
                        formatter: function (value) {
                            if (typeof value !== "undefined") {
                                // return y.toFixed(0) + " points";
                                return (value).toLocaleString('vn');
                            }
                            return value.toLocaleString('vn')
                        },
                        style:
                        {
                            colors: '#fa896b',
                        }
                    },
                    title: {
                        text: "Thanh toán (VNĐ)",
                        style:
                        {
                            fontSize: "9px",
                        }
                    },
                
                },],
                xaxis: {
                    categories: [],
                },
                grid: {
                    show: true,
                    xaxis: {
                        axisTicks: {
                            show: true,
                        },
                        lines: {
                            show: true,
                        },
                    },
                    yaxis: {
                        axisTicks: {
                            show: true,
                        },
                        lines: {
                            show: true,
                        },
                    },
                    padding: {
                        top: 0,
                        right: -2,
                        bottom: 15,
                        left: 10,
                    },
                },
                legend: {
                    show: true,
                    horizontalAlign: "center",
                    offsetX: 0,
                    offsetY: -5,
                    markers: {
                        width: 9,
                        height: 9,
                        radius: 6,
                    },
                    itemMargin: {
                        horizontal: 10,
                        vertical: 0,
                    },
                },
                plotOptions: {
                    bar: {
                        columnWidth: "30%",
                        barHeight: "70%",
                    },
                },
                colors: getChartColorsArray('[ "--vz-primary"]'),
                tooltip: {
                    shared: true,
                    y: [{
                        formatter: function (y) {
                            if (typeof y !== "undefined") {
                                return y.toFixed(0);
                            }
                            return y.toLocaleString('vi');
                        },
                    },],
                    custom: function({series, seriesIndex, dataPointIndex, w}) {
                        return '<div class="arrow_box">' +
                        '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
                        '</div>'
                    }
                },
            },
        
            dimention: 'day',
            dimensions,
            dimemtion_lable: {
                month: 'Tháng',
                week: 'Tuần',
                day: 'Ngày',
                quarter: 'Quý',
                year: 'Năm'

            },

            chartOptionsDonut: {
                plotOptions: {
                    labels: ['Khách hàng mới', 'Khách hàng tái ký'],
                    pie:
                    {
                        donut:
                        {
                            labels:
                            {
                                show: false,
                                value:
                                {
                                    show: true,
                                    // offsetY: -6,
                                    fontSize: "18px",
                                    color: "#343a40",
                                    formatter: function (val) {
                                        return (val);
                                    },
                                },
                                total:
                                {
                                    show: false,
                                  
                                },
                            },
                        },
                    },
                },
                labels: ['Khách hàng mới', 'Khách hàng tái ký'],

                colors: getChartColorsArray('[ "--vz-primary", "--vz-warning"]'),
                dataLabels:
                {
                    enabled: false,
                },
                legend:
                {
                    show: false,
                },
                yaxis:
                {
                    labels:
                    {
                        formatter: function (value) {
                            return (value);
                        },
                    },
                },
                stroke:
                {
                    curve: 'smooth',
                    lineCap: "round",
                    width: 2,
                },
            },


            // loading

            isLoadingChart: false,
            isLoadingStatistic: false,

        };
    },
    
    methods: {
        _get(obj, path, defaultValue) {
            return _get(obj, path, defaultValue);
        },
        getLabelChooseView(data, path, defaultValue = '--') {
            return getData(data, path, defaultValue)
        },

        async getDataChart()
        {
            this.isLoadingChart=true
            
            let response = await DashboardService.getDataChartOrder( {
                    selects: [
                        'revenue', 'total_orders'
                    ],
                    from:  this.date_range.from,
                    to: this.date_range.to,
                    dimension: this.dimention
                })


            if(_get(response, 'status') != 'success')
            {
                this.isLoadingChart= false
                return
            }
            let valueChart = _get(response, 'data', []).map((item) => {
                return {total_orders: item.total_orders}
            })


            this.series = [{
                ...this.series[0],
                data: _get(response, 'data', []).map((item) => {
                    return item.revenue || 0
                }) || []
            }]
            let categories = _get(response, 'data', []).map((item) => {
                    return changeLabelChart(item.date * 1000, this.dimention)
                })
            
            

            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    ...this.chartOptions.xaxis,
                    categories:categories || []
                },
                tooltip: {
                    ...this.chartOptions.tooltip,
                    custom: function({series, seriesIndex, dataPointIndex, w}) {
                        return '<div class="arrow_box ">' +
                        '<div class="p-1 tooltip-header bg-light">' + categories[dataPointIndex] + '</div>' +
                        '<div class="p-1 "><span> Thanh toán: <span  class="fw-medium">' + Number(series[seriesIndex][dataPointIndex]).toLocaleString('vn') + '</span></span>' +
                        '<div> Đơn hàng: '+  JSON.stringify(valueChart[dataPointIndex].total_orders) +'</span>' +
                        '</div></div>'
                    }
                }
            }
            this.isLoadingChart= false

        },

        async getDataStatistic(){
            this.isLoadingStatistic = true
            let response = await DashboardService.getstatisticChartOrder(
                {
                    selects: [
                        'approved_orders', 'cancelled_orders', 'resign_customers', 'pending_orders',
                    ],
                    current: {
                        from:  this.date_range.from,
                        to: this.date_range.to,
                    },
                    past: {
                        from: this.past_range.from,
                        to: this.past_range.to,
                    }
                }
            )

            this.dataStatistic = get(response, 'data') 
            
            this.isLoadingStatistic = false

        },
        
        getIcon(number) {
            return number > 0 ? '+' : number < 0 ? '-' : ''
        },

        getPercent(number1, number2) {
            if(number2 == 0 && number1 == 0)
            {
                return 0
            }
            if(number2 == 0)
            {
                return -100
            }

            return number1/number2 *100
        }
    },

    mounted() {
    },
    watch: {
        dimention(){
            this.getDataChart()
        },
        'date_range':{  
            handler(){
                this.getDataChart()
                this.getDataStatistic()
            },
            deep: true,
        }
    },
    computed: {
        ...dashboardComputed,
        lable_date_range(){
            return this.$store.state.dashboard.lable_date_range
        },
      
    }
};
</script>

<template>
    <b-card no-body style="margin-top: 2px;">
        <b-card-header class="border-0 align-items-center d-flex " style="margin-bottom: 20px !important;">
            <b-card-title class="mb-0 flex-grow-1 text-uppercase mt-n1">Đơn hàng</b-card-title>
            <div class="d-flex align-items-center gap-2 mt-n1">
                <div class="text-nowrap fw-medium">Xem theo:</div>
                <b-dropdown size="sm" variant="soft-primary">
                    <template #button-content  >
                        <div>
                            {{ getLabelChooseView(dimemtion_lable, dimention) }}
                        </div>
                    </template>
                    <b-dropdown-item v-for="(item, index) in dimensions" :key="index"
                        @click="dimention = item.value"
                        :class="{
                            'd-none': dimention == item.value
                        }"
                    >
                        {{ getLabelChooseView(item, 'text') }}
                    </b-dropdown-item>
                </b-dropdown>
            </div>

        </b-card-header>

        <b-card-body class="p-0 my-n4 border-0 bg-soft-light">
            <b-row class="g-0 text-center ">
                <b-col lg="3" md="12">
                    <div class="p-3 border  border-start-0 d-flex align-items-start flex-column">
                        <h6 class="fw-medium text-muted">Đơn được duyệt</h6>
                        <PlaceholderWraper :isLoading="isLoadingStatistic">
                            <h5 class="mb-1 d-flex align-items-center gap-2 ">
                                    <count-to :startVal="0" :endVal="_get(dataStatistic, 'data.current.approved_orders ', 0)" :duration="1000"></count-to>
                               
                            </h5>
                            <h6 class=" fs-12 mb-0 cursor-pointer" 
                                v-b-tooltip.hover="{title: lable_date_range + 'trước: ' + _get(dataStatistic, 'data.past.approved_orders', 0) }"
                                :class="{
                                    'text-success': _get(dataStatistic, 'compare.approved_orders',0) > 0,
                                    'text-danger': _get(dataStatistic, 'compare.approved_orders',0) < 0,
                                    'text-muted': _get(dataStatistic, 'compare.approved_orders',0) == 0,
                                }"    
                            >
                                <i 
                                    :class="{
                                    'ri-arrow-right-up-line fs-13 align-middle':_get(report_statistic, 'compare.approved_orders') > 0,
                                    'ri-arrow-right-down-line fs-13 align-middle':_get(report_statistic, 'compare.approved_orders') < 0,
                                }"
                                ></i>
                                {{ getIcon(_get(dataStatistic, 'compare.approved_orders',0)) }}                                
                                {{ _get(dataStatistic, 'compare.approved_orders_rate', '--') }} %
    
                            </h6>
                        </PlaceholderWraper>
                    </div>
                </b-col>
                <b-col lg="3" md="12">
                    <div class="p-3 border  border-start-0 d-flex align-items-start flex-column">
                        <h6 class="fw-medium text-muted">Đơn đã hủy</h6>
                        <PlaceholderWraper :isLoading="isLoadingStatistic">
                            <h5 class="mb-1 d-flex align-items-center gap-2 fs-5">
                                    <count-to :startVal="0" :endVal="_get(dataStatistic, 'data.current.cancelled_orders ', 0)" :duration="1000"></count-to>
                            </h5>
                            <h6 class="text-success fs-12 mb-0 cursor-pointer"  
                                v-b-tooltip.hover="{title: lable_date_range + 'trước: ' + _get(dataStatistic, 'data.past.cancelled_orders', 0) }"
                                :class="{
                                    'text-success': _get(dataStatistic, 'compare.cancelled_orders', 0) < 0,
                                    'text-danger': _get(dataStatistic, 'compare.cancelled_orders', 0) > 0,
                                    'text-muted': _get(dataStatistic, 'compare.cancelled_orders', 0) == 0,
                                }"    
                            >
                                <i :class="{
                                    'ri-arrow-right-up-line fs-13 align-middle':_get(report_statistic, 'compare.cancelled_orders') < 0,
                                    'ri-arrow-right-down-line fs-13 align-middle':_get(report_statistic, 'compare.cancelled_orders') > 0,
                                }"></i>
                                {{ getIcon(_get(dataStatistic, 'compare.cancelled_orders',0)) }}                                
                                {{ _get(dataStatistic, 'compare.cancelled_orders', '--') }} %
                            </h6>
                        </PlaceholderWraper>

                    </div>
                </b-col>
                <b-col lg="6" md="12">
                    <div class="pt-3 px-3 py-2 border  border-start-0 h-100 d-flex align-items-start flex-column">
                        <h6 class="fw-medium text-muted">Tỷ lệ đơn được duyệt / đơn đã hủy</h6>
                        <PlaceholderWraper :isLoading="isLoadingStatistic">
                            <h1 class=" d-flex align-items-end  gap-2 text-success mb-n1 " style="font-size: 36px; margin-top:2px">
                                <count-to :startVal="0" :endVal="getPercent(_get(dataStatistic, 'data.current.cancelled_orders ', 0), _get(dataStatistic, 'data.current.approved_orders ', 0))" :duration="1000" suffix="%"></count-to>
                            </h1>
                        </PlaceholderWraper>

                    </div>
                </b-col>
            </b-row>
        </b-card-body>
        <b-card-body class="pt-0 px-3 pb-2 mt-4 mb-n2">
            <div class="py-3" v-if="isLoadingChart"  style="height:320px;">
                <div class=" w-100 h-100 d-flex align-items-center justify-content-center text-primary" >
                    Đang lấy dữ liệu...
                </div>
            </div>
            <div class="w-100"  style="height:320px;" v-else>
                <apexchart class="apex-charts" height="336" type="line" dir="ltr" :series="series" :options="chartOptions">
                </apexchart>
            </div>
        </b-card-body>
        <b-card-footer>
            <b-row class="my-n2">
                <b-col cols="3" class=" ms-n5 d-flex align-items-center justify-content-start">
                    <apexchart class="apex-charts" dir="ltr" type="donut" height="100" :series="[_get(dataStatistic, 'data.current.first_sign_customers', 0), _get(dataStatistic, 'data.current.resign_customers', 0)]"
                        :options="chartOptionsDonut">
                    </apexchart>
                </b-col>
                <b-col cols="4" class=" ms-n5 mt-2 me-n5">
                    <div class="d-flex align-items-start justify-content-end flex-column ">
                        <h6 class="fw-medium text-muted">Khách hàng mới</h6>
                        <PlaceholderWraper :isLoading="isLoadingStatistic">
                            <div class="d-flex justify-content-start align-items-end gap-2">
                                <h2 style="font-size: 36px;" class="mb-n2 text-primary">
                                    <count-to :startVal="0" :endVal="_get(dataStatistic, 'data.current.first_sign_customers', 0)" :duration="500"></count-to>
                                </h2>
                                <h6 class="fs-14 mb-0"
                                    :class="{
                                        'text-danger': _get(dataStatistic, 'compare.first_sign_customers',0) < 0,
                                        'text-success': _get(dataStatistic, 'compare.first_sign_customers',0) > 0
                                    }"   
                                    v-b-tooltip.hover="{title: lable_date_range + 'trước: ' + _get(dataStatistic, 'data.past.first_sign_customers', 0) }"
                                >
                                    <i 
                                        :class="{
                                            'ri-arrow-right-up-line fs-13 align-middle': _get(dataStatistic, 'compare.first_sign_customers',0) > 0,
                                            'ri-arrow-right-down-line fs-13 align-middle': _get(dataStatistic, 'compare.first_sign_customers',0) < 0
                                        }"
                                    ></i>
                                    {{ getIcon(_get(dataStatistic, 'compare.first_sign_customers',0)) }}                                
                                    {{ _get(dataStatistic, 'compare.first_sign_customers_rate', '--') }} %    
                                </h6>
                            </div>
                        </PlaceholderWraper>
                    </div>
                </b-col>
                <b-col cols="4" class=" ms-n5 mt-2">
                    <div class="d-flex align-items-start justify-content-end flex-column ">
                        <h6 class="fw-medium text-muted">Khách hàng tái ký</h6>
                        <PlaceholderWraper :isLoading="isLoadingStatistic">
                            <div class="d-flex justify-content-start align-items-end gap-2">
                                <h2 style="font-size: 36px;" class="mb-n2 text-warning">
                                    <count-to :startVal="0" :endVal="_get(dataStatistic, 'data.current.resign_customers', 0)" :duration="500"></count-to>
                                </h2>
                                <h6 class=" fs-14 mb-0"
                                    :class="{
                                        'text-danger': _get(dataStatistic, 'compare.resign_customers',0) < 0,
                                        'text-success': _get(dataStatistic, 'compare.resign_customers',0) > 0
                                    }" 
                                    v-b-tooltip.hover="{title: lable_date_range + 'trước: ' + _get(dataStatistic, 'data.past.resign_customers', 0) }"
                                >
                                    <i
                                        :class="{
                                            'ri-arrow-right-up-line fs-13 align-middle': _get(dataStatistic, 'compare.resign_customers',0) > 0,
                                            'ri-arrow-right-down-line fs-13 align-middle': _get(dataStatistic, 'compare.resign_customers',0) < 0
                                        }"
                                    ></i>
                                    {{ getIcon(_get(dataStatistic, 'compare.resign_customers',0)) }}                                
                                    {{ _get(dataStatistic, 'compare.resign_customers_rate', '--') }} %    
                                </h6>
                            </div>

                        </PlaceholderWraper>
                    </div>
                </b-col>
            </b-row>
        </b-card-footer>
    </b-card>
</template>


<style src="@vueform/multiselect/themes/default.css"></style>
