<script>

import { dimensions } from "../../../config/dimensions";


import {
    CountTo
} from "vue3-count-to";

import { getData } from "../../../helpers/utils";
import moment from "moment";

import dashboardService from "../../../services/dashboard.service";
import { dashboardComputed } from '../../../state/helpers'

import { calculatePercentage, changeLabelChart, converTimestampToDate, convertNumber } from '../../../helpers/utils'


import placeholderWraper from "../../ui/placeholder-wraper.vue";
export default {
    components: {
        CountTo,
        placeholderWraper,
    },
    data() {
        return {
            series: [{
                name: "Số lượng học viên",
                type: "area",
                data: [],
            },
            {
                name: "Doanh thu",
                type: "bar",
                data: [],
            },
            {
                name: "Số lượng đơn",
                type: "line",
                data: [],
            },
            ],
            chartOptions: {
                noData: {
                    text: 'Không có dữ liệu thống kê!!!',
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: '#FA896B',
                        fontSize: '14px',
                        fontFamily: undefined
                    }
                },
                chart: {
                    height: 370,
                    type: "line",
                    toolbar: {
                        show: false,
                    },
                },
                stroke: {
                    curve: "straight",
                    dashArray: [0, 0, 8],
                    width: [2, 0, 2.2],
                },
                fill: {
                    opacity: [0.1, 0.9, 1],
                },
                markers: {
                    size: [0, 0, 0],
                    strokeWidth: 2,
                    hover: {
                        size: 4,
                    },
                },
                xaxis: {
                    categories: [],
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: true,
                    },
                },
                yaxis: {
                    axisBorder: {
                        show: true,
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
                },
                grid: {
                    show: true,
                    xaxis: {
                        lines: {
                            show: true,
                        },
                    },
                    yaxis: {
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
                colors: this.getChartColorsArray('["--vz-warning", "--vz-primary", "--vz-success"]'),
                tooltip: {
                    shared: true,
                    y: [{
                        formatter: function (y) {
                            if (typeof y !== "undefined") {
                                return  y.toLocaleString('en-US');
                            }
                            return y;
                        },
                    },
                    {
                        formatter: function (y) {
                            if (typeof y !== "undefined") {
                                return y.toLocaleString('en-US');
                            }
                            return y;
                        },
                    },
                    {
                        formatter: function (y) {
                            if (typeof y !== "undefined") {
                                return y.toLocaleString('en-US');
                            }
                            return y;
                        },
                    },
                    ],
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
            isLoading: false,
            isLoadingStatistic: false,
            report_statistic: {},
            report_chart: [],
        };
    },

    computed: {
        ...dashboardComputed,

        query_option() {
            return [this.date_range, this.dimention]
        },
    },

    mounted() {
        // this.getReportStatistic({
        //     selects: [
        //         'total_students', 'revenue', 'total_orders'
        //     ],
        //     current: {
        //         form: this._moment(new Date()).startOf('month').unix(),
        //         to: this._moment(new Date()).endOf('month').unix(),
        //     },
        //     past: {
        //         form: this._moment(new Date()).subtract(1, 'month').startOf('month').unix(),
        //         to: this._moment(new Date()).subtract(1, 'month').endOf('month').unix(),
        //     }
        // })

        // this.getReportChart({
        //     selects: [
        //         'total_students', 'revenue', 'total_orders'
        //     ],
        //     from: this._moment(new Date()).startOf('month').unix(),
        //     to: this._moment(new Date()).endOf('month').unix(),
        //     dimension: 'month',
        // })   
    },

    watch: {
        query_option: {
            deep: true,
            handler(newValue) {
                this.getReportChart({
                    from: newValue[0].from,
                    to: newValue[0].to,
                    dimension: newValue[1],
                })
            }
        },

        date_range: {
            deep: true,
            handler(newValue) {
                this.getReportStatistic({
                    selects: [
                        'total_students', 'revenue', 'total_orders'
                    ],
                    current: {
                        from: newValue.from,
                        to: newValue.to,
                    },
                    past: {
                        from: this.past_range.from,
                        to: this.past_range.to,
                    }
                })
            }
        }
    },
    methods: {
        _getData(data, path, defaultValue = '--') {
            return getData(data, path, defaultValue)
        },

        _moment(date) {
            moment.locale('vi')
            return moment(date)
        },

        _converTimestampToDate(timestamp){
            return converTimestampToDate(timestamp)
        },

        _changeLabelChart(timestamp, dimention) {
            return changeLabelChart(timestamp, dimention)
        },

        _convertNumber(number) {
            return convertNumber(number)
        },

        getChartColorsArray(colors) {
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
        },

        _calculatePercentage(number1, number2) {
            return calculatePercentage(number1, number2)
        },
        async getReportStatistic(query) {
            this.isLoadingStatistic = true;
            const res = await dashboardService.getReportBoxOverview(query)
            this.report_statistic = this._getData(res, 'data', {})
            this.isLoadingStatistic = false
        },

        async getReportChart(query) {
            this.isLoading = true
            const res = await dashboardService.getReportChartMain(query)
            this.report_chart = this._getData(res, 'data', [])
            
            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    ...this.chartOptions.xaxis,
                    categories: this.report_chart.map(item => this._changeLabelChart(item.date * 1000, this.dimention))
                }
            }
            
            this.series = [
                {
                    name: 'Doanh thu',
                    data: this.report_chart.map(item => item.revenue)
                },
                {
                    name: 'Số lượng học viên',
                    data: this.report_chart.map(item => item.total_students)
                },
                {
                    name: 'Số lượng đơn hàng',
                    data: this.report_chart.map(item => item.total_orders)
                }
            ]


            this.isLoading = false
        },

        getIcon(number) {
            return number > 0 ? '+' : number < 0 ? '-' : ''
        }
    }
};
</script>

<template>
    <b-card no-body>
        <b-card-header class="border-0 align-items-center d-flex">
            <b-card-title class="mb-0 flex-grow-1 text-uppercase">Báo cáo chung</b-card-title>
            <div class="d-flex align-items-center gap-2">
                <div class="text-nowrap fw-medium">Xem theo:</div>
                <b-dropdown size="sm" variant="soft-primary">
                    <template #button-content>
                        <div>
                            {{ _getData(dimemtion_lable, dimention) }}
                        </div>
                    </template>
                    <b-dropdown-item v-for="(item, index) in dimensions" :key="index" @click="dimention = item.value" :class="{'d-none': dimention == item.value}">
                        {{ _getData(item, 'text') }}
                    </b-dropdown-item>
                </b-dropdown>
            </div>

        </b-card-header>

        <b-card-header class="p-0 border-0 bg-soft-light">
            <b-row class="g-0 text-center">
                <b-col lg="4" md="12">
                    <div class="p-3 border border-dashed border-start-0 d-flex align-items-center flex-column">
                        <placeholder-wraper :isLoading="isLoadingStatistic">
                            <h5 class="mb-1 d-flex align-items-center gap-2">
                                <count-to :startVal="0" :endVal="_getData(report_statistic, 'current.total_students', 0)"
                                    :duration="1000"></count-to>
                                <div class="fs-14 mb-0"  
                                    v-b-tooltip="{title: 'Chênh lệch: ' + _convertNumber(_getData(report_statistic, 'current.total_students', 0)) }"
                                    :class="{
                                        'text-success': _getData(report_statistic, 'compare.total_students') > 0,
                                        'text-danger': _getData(report_statistic, 'compare.total_students') < 0,
                                        'text-muted': _getData(report_statistic, 'compare.total_students') == 0,
                                    }"
                                >
                                    <i :class="{
                                        'ri-arrow-right-up-line fs-13 align-middle':_getData(report_statistic, 'compare.total_students') > 0,
                                        'ri-arrow-right-down-line fs-13 align-middle':_getData(report_statistic, 'compare.total_students') < 0,
                                    }"></i>
                                    {{ getIcon(_getData(report_statistic, 'compare.total_students',0)) }}                                
                                    {{ _getData(report_statistic, 'compare.total_students_rate') }} %
                                </div>
                            </h5>
                        </placeholder-wraper>
                        <p class="text-muted mb-0">Số lượng học viên</p>
                    </div>
                </b-col>
                <b-col lg="4" md="12">
                    <div class="p-3 border border-dashed border-start-0 d-flex align-items-center flex-column">
                        <placeholder-wraper :isLoading="isLoadingStatistic">
                            <h5 class="mb-1 d-flex align-items-center gap-2">
                                <count-to :startVal="0" :endVal="_getData(report_statistic, 'current.total_orders', 0)"
                                    :duration="1000"></count-to>
                                <div class="fs-14 mb-0" 
                                    v-b-tooltip="{title: 'Chênh lệch: ' + _convertNumber(_getData(report_statistic, 'current.total_orders', 0)) }"
                                    :class="{
                                        'text-success': _getData(report_statistic, 'compare.total_orders') > 0,
                                        'text-danger': _getData(report_statistic, 'compare.total_orders') < 0,
                                        'text-muted': _getData(report_statistic, 'compare.total_orders') == 0,
                                    }"
                                >
                                    <i :class="{
                                        'ri-arrow-right-up-line fs-13 align-middle':_getData(report_statistic, 'compare.total_orders') > 0,
                                        'ri-arrow-right-down-line fs-13 align-middle':_getData(report_statistic, 'compare.total_orders') < 0,
                                    }"></i>
                                    {{ getIcon(_getData(report_statistic, 'compare.total_orders',0)) }}                                
                                    {{ _getData(report_statistic, 'compare.total_orders_rate') }} %
                                </div>
                            </h5>
                        </placeholder-wraper>
                        <p class="text-muted mb-0">Số lượng đơn</p>
                    </div>
                </b-col>
                <b-col lg="4" md="12">
                    <div class="p-3 border border-dashed border-start-0 d-flex align-items-center flex-column">
                        <placeholder-wraper :isLoading="isLoadingStatistic">
                            <h5 class="mb-1 d-flex align-items-center gap-2">
                                <count-to :startVal="0" :endVal="_getData(report_statistic, 'current.revenue', 0)"
                                    :duration="1000"></count-to>
                                    <div class="fs-14 mb-0" 
                                        v-b-tooltip="{title: 'Chênh lệch: ' + _convertNumber(_getData(report_statistic, 'current.revenue', 0)) }"
                                        :class="{
                                            'text-success': _getData(report_statistic, 'compare.revenue') > 0,
                                            'text-danger': _getData(report_statistic, 'compare.revenue') < 0,
                                            'text-muted': _getData(report_statistic, 'compare.revenue') == 0,
                                        }"
                                    >
                                        <i :class="{
                                            'ri-arrow-right-up-line fs-13 align-middle':_getData(report_statistic, 'compare.revenue') > 0,
                                            'ri-arrow-right-down-line fs-13 align-middle':_getData(report_statistic, 'compare.revenue') < 0,
                                        }"></i>
                                        {{ getIcon(_getData(report_statistic, 'compare.revenue',0)) }}                                
                                        {{ _getData(report_statistic, 'compare.revenue_rate') }} %
                                    </div>
                            </h5>
                        </placeholder-wraper>
                        <p class="text-muted mb-0">Doanh thu</p>
                    </div>
                </b-col>
            </b-row>
        </b-card-header>

        <b-card-body class="p-0 pb-2">
            <div class="w-100 position-relative" style="height:380px;">
                <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center text-primary" v-if="isLoading">
                    Đang lấy dữ liệu...
                </div>
                <div 
                    :class="{
                        'd-none': isLoading
                    }"
                >
                    <apexchart class="apex-charts" height="100%" type="line" dir="ltr" :series="series" :options="chartOptions"
                        
                    >
                    </apexchart>
                </div>
            </div>
        </b-card-body>
    </b-card>
</template>


<style src="@vueform/multiselect/themes/default.css"></style>