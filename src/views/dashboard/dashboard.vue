<script>
import listBoxReport from '../../components/page/dashboard/list-box-report.vue';
import listBoxReportSub from '../../components/page/dashboard/list-box-report-sub.vue';
import chartMain from '../../components/page/dashboard/chart-main.vue';
import chartDonutRight from '../../components/page/dashboard/chart-donut-right.vue';
import top5CourseSell from '../../components/page/dashboard/top5-course-sell.vue';
import dashboardOrderListVue from '../../components/page/dashboard/dashboard-order-list.vue';
// from '../../components/page/dashboard/chart-donut-right.vue';
// import PageHeader from "@/components/page-header";
import chartCourseCapacity from '../../components/page/dashboard/chart-course-capacity.vue';
import { reactive } from "vue";
import '@vuepic/vue-datepicker/dist/main.css'
import '../../assets/scss/config/modern/custom-datepicker.scss'
import ChartOrder from '../../components/page/dashboard/chart-order.vue';
// import { CountTo } from "vue3-count-to";

import { dateFormatter } from "../../helpers/formatter";
import { preset_dates, day_label } from "../../config/date-picker";
import { dimensions } from "../../config/dimensions";
import Multiselect from '@vueform/multiselect'
import "@vueform/multiselect/themes/default.css"
import moment from 'moment';
import _get from "lodash/get"
import DashboadContractList from '../../components/page/dashboard/dashboad-contract-list.vue';
import DashboardCoursePublish from '../../components/page/dashboard/dashboard-course-publish.vue';
export default {
    components: {
        // VueDatePicker,
        // PageHeader,
        Multiselect,
        listBoxReport,
        chartCourseCapacity,
        chartMain,
        ChartOrder,
        chartDonutRight,
        top5CourseSell,
        DashboadContractList,
        DashboardCoursePublish,
        dashboardOrderListVue,
    },
    setup() {
        let state = reactive({

            dimension: 'day',
            date_range: 'month',
            zone: {
                label: 'Tất cả địa điểm',
                value: 'all'
            },
        });

        let config = {
            dimensions,
            preset_dates,
            day_label,
            min_date: moment().set({ 'year': 2015, 'month': 1, 'day': 1 }).startOf('date').toDate(),
            max_date: moment().endOf('date').toDate(),
        }

        return { state, config, dateFormatter }
    },

    data() {
        return {
            isDark: 'light',
            select_dates: [
                {
                    label: 'Trong tuần này',
                    value: 'week',
                },
                {
                    label: 'Trong tháng này',
                    value: 'month',
                },
                {
                    label: 'Trong quý này',
                    value: 'quarter',
                },
                {
                    label: 'Trong năm này',
                    value: 'year',
                },

            ]
        }
    },

    mounted() {
        this.isDark = localStorage.getItem('GURUB-data-layout-mode') == 'dark'
        this.setStateDateRange()
        this.setZone(this.state.zone)
    },

    methods: {
        _get(item, ref, _default) {
            return _get(item, ref, _default);
        },

        setStateDateRange(mode='medium')
        {
            
            if(mode=='medium')
            {
                
                this.$store.dispatch('dashboard/set_date_range', this.state.date_range)
            }
            if(mode=='reset')
            {
                this.state.date_range= 'month'
                this.$store.dispatch('dashboard/set_date_range', this.state.date_range)
            }
        },

        setZone(zone)
        {
            this.state.zone = zone
            this.$store.dispatch('dashboard/set_zone', this.state.zone.value)
        },

        getTime()
        {
            const now = new Date();
            const hour = now.getHours();

            if (hour >= 1 && hour < 6) 
            {
                return "buổi đêm";
            } 
            if (hour >= 6 && hour < 11) 
            {
                return "buổi sáng";
            } 
            if (hour >= 11 && hour <= 17) 
            {
                return "buổi chiều";
            } 
            if (hour > 17 && hour < 24) 
            {
                return "buổi tối";
            } 
        }
    },

    computed: {
        date_range_state() {
            return this.$store.state.dashboard.date_range;
        },
        isDarkComputed() {
            return this.$store.state.layout.mode == 'dark'
        }
    },

    watch: {
        'state.date_range': {
            handler(newValue) {
                this.setStateDateRange()
            },
            deep: true
        },
    }
}


</script>


<template>
    <div class="h-100" style="position: relative">
        <div class="d-flex align-items-lg-center flex-lg-row flex-column header-filter page-title-box" >
            <div class="flex-grow-1">
                    <h4 class="fs-16 mb-1">Chào {{getTime()}}, Nhi!</h4> 
                    <p class="text-muted mb-0">
                        Đây là báo cáo tổng quan các thông số trực quan của bạn. 
                    </p>
                </div>
                <div class="flex-shink-0 mt-3 mt-lg-0 d-flex gap-2">
                    <div>
                        <Multiselect  
                            mode="single" placeholder="Chọn giá trị" style="min-width: 15rem"
                            :options="select_dates" v-model="state.date_range"
                            :can-deselect="false" 
                            :can-clear="false"
                        >
                            
                        </Multiselect>
                    </div>
                    <!-- <div class="" v-if="isDarkComputed">
                        <VueDatePicker
                            range arrow-navigation timezone="Asia/Ho_chi_minh" locale="vi" month-name-format="long"
                            position="right"
                            menu-class-name="shadow-sm "
                            input-class-name="dp-custom-input"
                            :dark="true"
                            :multi-calendars=" true "
                            :enableTimePicker="false"
                            :format="(value) => dateFormatter(value, 'array')"
                            :preset-ranges="config.preset_dates"
                            :max-date="config.max_date"
                            :min-date="config.min_date"
                            :disabled="state.is_loading"
                            v-model="state.date_range"
                        >
                            <template #calendar-header="{ index }">
                                <div 
                                    class="text-primary"
                                >
                                    {{ _get(config, `day_label.${index}`) }}
                                </div>
                            </template>
z                            <template #action-row="{ selectDate }">
                                <div class="action-row d-flex align-items-center justify-content-end w-100">
                                    <b-button 
                                        size="sm" variant="secondary" 
                                        @click="selectDate"
                                    >
                                        Chọn ngày
                                    </b-button>
                                </div>
                            </template>
                        </VueDatePicker>
                    </div>
                    <div class="" v-if="!isDarkComputed">
                        <VueDatePicker
                            range arrow-navigation timezone="Asia/Ho_chi_minh" locale="vi" month-name-format="long"
                            position="right"
                            menu-class-name="shadow-sm "
                            input-class-name="dp-custom-input"
                            :multi-calendars=" true "
                            :enableTimePicker="false"
                            :format="(value) => dateFormatter(value, 'array')"
                            :preset-ranges="config.preset_dates"
                            :max-date="config.max_date"
                            :min-date="config.min_date"
                            :disabled="state.is_loading"
                            v-model="state.date_range"
                        >
                            <template #calendar-header="{ index }">
                                <div 
                                    class="text-primary"
                                >
                                    {{ _get(config, `day_label.${index}`) }}
                                </div>
                            </template>
                            <template #action-row="{ selectDate }">
                                <div class="action-row d-flex align-items-center justify-content-end w-100">
                                    <b-button 
                                        size="sm" variant="secondary" 
                                        @click="selectDate"
                                    >
                                        Chọn ngày
                                    </b-button>
                                </div>
                            </template>
                        </VueDatePicker>
                    
                    
                    
                    </div> -->
                    <!-- <b-dropdown size="sm" :text="state.zone.label" >
                        <b-dropdown-item 
                            @click="setZone({label: 'Tất cả địa điểm', value: 'all'})"
                            v-if="state.zone.value != 'all'"
                        >Tất cả địa điểm
                        </b-dropdown-item>
                        <b-dropdown-item
                            @click="setZone({label: 'Hồ Chí Minh', value: 'hcm'})"
                            v-if="state.zone.value != 'hcm'"
                        >Hồ Chí Minh</b-dropdown-item>
                        <b-dropdown-item 
                            @click="setZone({label: 'Hà Nội', value: 'hn'})"
                            v-if="state.zone.value != 'hn'"    
                        >Hà Nội</b-dropdown-item>
                    </b-dropdown> -->
                    <b-button type="button" variant="info" class="text-nowrap" size="sm" :disabled="true">
                        <i class="ri-pulse-line"></i>
                        Xuất báo cáo
                    </b-button>
                </div>
            </div>
            <div v-if="state.date_range">
                <list-box-report />
                <b-row>
                    <b-col cols="8">
                        <chartMain/>
                    </b-col>
                    <b-col cols="4">
                        <chartDonutRight/>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="4">
                        <chartCourseCapacity/>
                    </b-col>
                    <b-col cols="8">
                        <ChartOrder/>
                    </b-col>
                </b-row>

                <b-row>
                    <h4 class="py-1">
                        BÁO CÁO CỐ ĐỊNH
                    </h4>
                </b-row>
                <b-row class="flex-shink-0">
                    <b-col cols="4" class="h-100">
                        <top5CourseSell/>
                    </b-col>
                    <b-col cols="8" class="h-100">
                        <dashboardOrderListVue></dashboardOrderListVue>

                        <DashboardCoursePublish/>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12">
                        <DashboadContractList/>

                    </b-col>

                </b-row>
            </div> 
            <div v-else>
                
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <h2 class="text-danger fw-bold">
                        Vui lòng chọn thời gian để hiển thị các báo cáo!!
                    </h2>
                    <h3 class="d-block">
                        Hoặc xem 7 ngày gần nhấn <b-button size="md" variant="secondary" @click="setStateDateRange('reset')">tại đây</b-button>
                    </h3>
                </div>
            </div> 
    </div>
</template>

<style lang="scss" scoped>
.header-filter {
    position: sticky;
    top: 69.907px;
    z-index: 1000;
    border-top: 2px solid #f4f4f4;
    box-shadow: 0 1.5px 2.5px rgba(166, 192, 219, 0.15);
}
</style>
