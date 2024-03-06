

<script>
import { CountTo } from "vue3-count-to";
import dashboardService from "../../../services/dashboard.service";
import moment from "moment";
import {dashboardComputed} from '../../../state/helpers'
import { getData } from "../../../helpers/utils";
import {calculatePercentage, convertNumber} from '../../../helpers/utils'

import placeholderWraper from "../../ui/placeholder-wraper.vue";
export default {
    components: {
        CountTo,
        placeholderWraper,
    },

    data() {
        return {
            isLoading: false,
            report_data: {}
        }
    },
    
    computed: {
        ...dashboardComputed,

    },
    mounted() {
        // this.getReportData({
        //     current: {
        //         form: this._moment(new Date()).startOf('month').unix(),
        //         to: this._moment(new Date()).endOf('month').unix(),
        //     },

        //     past: {
        //         form: this._moment(new Date()).subtract(1, 'month').startOf('month').unix(),
        //         to: this._moment(new Date()).subtract(1, 'month').endOf('month').unix(),
        //     }
        // });
    },

    methods: {
        _moment(date) {
            return moment(date);
        },

        _calculatePercentage(number1, number2) {
            return calculatePercentage(number1, number2);
        },

        _convertNumber(number) {
            return convertNumber(number);
        },

        _getData(data, ref, defaultValue = 0) {
            return getData(data, ref, defaultValue);
        },
        
        async getReportData(date_range) {
            this.isLoading = true
            const res= await dashboardService.getReportBoxOverview(date_range)
            this.report_data = this._getData(res, 'data')
            this.isLoading = false
        },

        getIcon(number) {
            return number > 0 ? '+' : number < 0 ? '-' : ''
        }
    },
    
    watch: {
        'date_range': {
            deep: true,
            handler(newValue) {
                this.getReportData({
                    selects: ['revenue', 'total_orders', 'total_customers'],
                    current: newValue,
                    past: this.past_range
                })
            }
        }
    },

}
</script>

<template>
    <b-row>
        <b-col lg="4" md="12">
            <b-card no-body class="card-animate">
                <b-card-body>
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1 overflow-hidden">
                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0">
                                Tổng doanh thu
                            </p>
                        </div>
                        <placeholder-wraper :isLoading="isLoading">
                            <div class="flex-shrink-0">
                                <h5 class="fs-14 mb-0" v-b-tooltip="{title: 'Chênh lệch: ' + _convertNumber(_getData(report_data, 'compare.revenue', 0)) }"
                                    :class="{
                                        'text-success': _getData(report_data, 'compare.revenue') > 0,
                                        'text-danger': _getData(report_data, 'compare.revenue') < 0,
                                        'text-muted': _getData(report_data, 'compare.revenue') == 0,
                                    }"
                                >
                                    <i :class="{
                                        'ri-arrow-right-up-line fs-13 align-middle':_getData(report_data, 'compare.revenue') > 0,
                                        'ri-arrow-right-down-line fs-13 align-middle':_getData(report_data, 'compare.revenue') < 0,
                                    }"></i>
                                    {{ getIcon(_getData(report_data, 'compare.revenue',0)) }}                                
                                    {{ _getData(report_data, 'compare.revenue_rate') }} %
                                </h5>
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-end justify-content-between mt-4">
                        <div>
                           <div class=" mb-4">
                               <placeholder-wraper :isLoading="isLoading">
                                    <h4 class="fs-22 fw-semibold ff-secondary">
                                        <count-to :startVal='0' :endVal='_getData(report_data, "current.revenue")' :duration='1000'></count-to>
                                    </h4>
                               </placeholder-wraper>
                           </div>
                            <router-link to="/payments" class="text-decoration-underline text-muted">Xem danh sách thanh
                                toán</router-link>
                        </div>
                        <b-button variant='success' class="avatar-sm d-flex justify-content-center align-items-center ">
                            <span class="rounded text-white ">
                                <i class="bx bx-dollar-circle mt-1" style="font-size: 30px"></i>
                            </span>
                        </b-button>
                    </div>
                </b-card-body>
            </b-card>
        </b-col>

        <b-col lg="4" md="12">
            <b-card no-body class="card-animate">
                <b-card-body>
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1 overflow-hidden">
                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0">
                                ĐƠN MỚI
                            </p>
                        </div>
                        <placeholder-wraper :isLoading="isLoading">
                            <div class="flex-shrink-0">
                                <h5 class=" fs-14 mb-0" v-b-tooltip="{title: 'Chênh lệch: ' + _convertNumber(_getData(report_data, 'compare.total_orders', 0)) }"
                                    :class="{
                                        'text-success': _getData(report_data, 'compare.total_orders') > 0,
                                        'text-danger': _getData(report_data, 'compare.total_orders') < 0,
                                        'text-muted': _getData(report_data, 'compare.total_orders') == 0,
                                    }"
                                >
                                <i :class="{
                                    'ri-arrow-right-up-line fs-13 align-middle':_getData(report_data, 'compare.total_orders') > 0,
                                    'ri-arrow-right-down-line fs-13 align-middle':_getData(report_data, 'compare.total_orders') < 0,
                                }"></i>
                                {{ getIcon(_getData(report_data, 'compare.total_orders',0)) }}  
                                {{_getData(report_data, 'compare.total_orders_rate') }} %
                                </h5>
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-end justify-content-between mt-4">
                        <div>
                           <div class=" mb-4">
                               <placeholder-wraper :isLoading="isLoading">
                                    <h4 class="fs-22 fw-semibold ff-secondary">
                                        <count-to :startVal='0' :endVal='_getData(report_data, "current.total_orders")' :duration='1000'></count-to>
                                    </h4>
                               </placeholder-wraper>
                           </div>
                            <router-link to="/orders" class="text-decoration-underline text-muted">Xem danh sách hóa
                                đơn</router-link>
                        </div>
                        <b-button variant='info' class="avatar-sm d-flex justify-content-center align-items-center ">
                            <span class="rounded text-white ">
                                <i class="bx bx-shopping-bag mt-1" style="font-size: 30px"></i>
                            </span>
                        </b-button>
                    </div>
                </b-card-body>
            </b-card>
        </b-col>
        <b-col lg="4" md="12">
            <b-card no-body class="card-animate">
                <b-card-body>
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1 overflow-hidden">
                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0">
                                KHÁCH HÀNG MỚI
                            </p>
                        </div>
                        <placeholder-wraper :isLoading="isLoading">
                            <div class="flex-shrink-0">
                                <h5 class=" fs-14 mb-0" v-b-tooltip="{title: 'Chênh lệch: ' + _convertNumber(_getData(report_data, 'compare.total_customers ', 0)) }"
                                    :class="{
                                        'text-success': _getData(report_data, 'compare.total_customers ',0) > 0,
                                        'text-danger': _getData(report_data, 'compare.total_customers ',0) < 0,
                                        'text-muted': _getData(report_data, 'compare.total_customers ',0) == 0,
                                    }"
                                >
                                <i :class="{
                                    'ri-arrow-right-up-line fs-13 align-middle':_getData(report_data, 'compare.total_customers ',0) > 0,
                                    'ri-arrow-right-down-line fs-13 align-middle':_getData(report_data, 'compare.total_customers ',0) < 0,
                                }"></i>
                                {{ getIcon(_getData(report_data, 'compare.total_customers ',0)) }}  
                                {{ _getData(report_data, 'compare.total_customers_rate') }} %
                                </h5>
                            </div>
                        </placeholder-wraper>
                    </div>
                    <div class="d-flex align-items-end justify-content-between mt-4">
                        <div>
                           <div class=" mb-4">
                               <placeholder-wraper :isLoading="isLoading">
                                    <h4 class="fs-22 fw-semibold ff-secondary">
                                        <count-to :startVal='0' :endVal='_getData(report_data, "current.total_customers ")' :duration='1000'></count-to>
                                    </h4>
                               </placeholder-wraper>
                           </div>
                            <b-link href="/customers " class="text-decoration-underline text-muted">Xem danh sách khách
                                hàng</b-link>
                        </div>
                        <b-button variant='warning' class="avatar-sm d-flex justify-content-center align-items-center ">
                            <span class="rounded text-white ">
                                <i class="bx bx-user-circle  mt-1" style="font-size: 30px"></i>
                            </span>
                        </b-button>
                    </div>
                </b-card-body>
            </b-card>
        </b-col>
    </b-row>
</template>

<style lang="scss" scoped></style>
