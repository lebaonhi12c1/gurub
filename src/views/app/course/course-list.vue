<script>
import {
    required,
    helpers,
    numeric,
    maxLength,
    maxValue,
} from "@vuelidate/validators";
import useVuelidate from '@vuelidate/core';

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/l10n/vn';
import ButtonHandle from '../../../components/ui/button-handle.vue';
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import FadeContainer from "../../../components/ui/fade-container.vue";
import CardReport from "../../../components/ui/card/card-report-ver2.vue";
import { CountTo } from "vue3-count-to";
import _isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import NoresultTable from '../../../components/ui/noresult-table.vue';
import CourseService from '../../../services/course.service'
import Pagination from '../../../components/ui/pagination/pagination.vue'
import {label_course} from '../../../config/labels/label-course'

import rightSidebarUpdate from '../../../components/ui/modal/right-sidebar-update.vue';
import Avatar from "../../../components/ui/avatar/avatar.vue"
import Text from "../../../components/ui/text.vue"
import moment from "moment"
import { reactive } from "vue";
import FilterContainer from "../../../components/ui/filter/filterContainer.vue";
import config from '../../../config/filter/field/course-fields'
import course_type from '../../../config/type/course-typ'
import zone_type from '../../../config/type/zone-type'
import { getToastError } from "../../../helpers/toast";
import { convertDateToTimestamp, convertNumber, convertStringToNumber, convertCurrencyToNumber } from '../../../helpers/utils';

export default {
    setup() {
        return reactive({
            get,
            label_course,
            moment,
            course_type,
            zone_type
        })
    },

    data() {
        return {

            // loading
            isLoading: false,
            isLoadingStatistic: false,
            isLoadingUpdate: false,
            isLoadingInfoDetail: false,

            //fields table
            fields:  [
                { key: 'code', label: 'Mã khóa học', stickyColumn: true, tdClass: 'bg-light text-info fw-medium text-nowrap', thClass: 'bg-light text-nowrap',  },
                { key: 'name', label: 'Tên khóa học', thClass: 'bg-light text-start text-nowrap', tdClass: 'text-nowrap',   },
                { key: 'type', label: 'Loại khóa học', thClass: 'bg-light text-nowrap text-start', tdClass: 'text-nowrap text-start',  },
                { key: 'level', label: 'Mức độ', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center',  },
                { key: 'zone', label: 'Địa điểm' , thClass: 'bg-light text-start text-nowrap', tdClass: 'text-nowrap text-start', },
                { key: 'stage', label: 'Tình trạng', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center', },
                { key: 'method', label: 'Hình thức', thClass: 'bg-light text-start text-nowrap', tdClass: 'text-nowrap text-start',  },
                { key: 'original_price', label: 'Giá gốc', thClass: 'bg-light text-end text-nowrap', tdClass: 'text-nowrap text-end text-danger ',  },
                { key: 'discounted_price', label: 'Giá đã giảm', thClass: 'bg-light text-end text-nowrap', tdClass: 'text-nowrap text-end text-danger fw-medium'},
                { key: 'instructor', label: 'Giảng viên', thClass: 'bg-light text-nowrap', tdClass: 'text-nowrap'},
                { key: 'capacity', label: 'Sức chứa ', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center',  },
                { key: 'start_date', label: 'Ngày khai giảng', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', },
                { key: 'end_date', label: 'Ngày kết thúc', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', },
                { key: 'status', label: 'Trạng thái', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center', },
                { key: 'created_at', label: 'Ngày tạo', thClass: 'bg-light text-nowrap text-end', tdClass: 'text-nowrap text-end', },
                { key: 'action', label: 'Hành động', thClass: 'bg-light text-nowrap text-center', tdClass: 'text-nowrap text-center px-4', tdstyle:'min-width: 120px;' }
            ],

            // data 
            items_data_table: [],
            items_data_statistic: {},


            //pagination
            currentPage: 1,
            page: {
                per_page: 25,
                total: 0,
                from: 0,
                to: 0,
            },

            //filter
            config_filter: config,
            filters: [],
            orders: [
                {
                    name: "created_at",
                    value: "desc"
                }
            ],

            //validation
            validator: useVuelidate(),

            //form update course
            form: {
                id: null,
                name: '',
                description: '',
                code: '',
                unit: 'vnd',
                original_price: 0,
                discounted_price: 0,
                sale_price: 0,
                start_date: 0,
                end_date: 0,
                start_time: '',
                end_time: '',
                capacity: 0,
                zone: '',
                type: '',
                level: '',
                status: '',
                stage: '',
                method: '',
            },

            updateSidebarModal: false,

            config: {
                wrap: true, // set wrap to true only when using 'input-group'
                altFormat: 'd/m/Y',
                altInput: true,
                // dateFormat: 'Y-m-d',
                locale: 'vn',
            },
            info_detail: {},

            methods: [
                { text: 'Online', value: 'online' },
                { text: 'Offline', value: 'offline' },
            ],
            types: [
                { text: 'Google Ads', value: 'google-ads' },
                { text: 'Facebook Ads', value: 'facebook-ads' },
            ],
            levels: [
                { text: 'Cơ bản', value: 'basic' },
                { text: 'Nâng cao', value: 'advanced' },
            ],
            zones: [
                { text: 'Hồ Chí Minh', value: 'hcm' },
                { text: 'Hà nội', value: 'hn' },
            ],

            statuss: [
                { text: 'Bản nháp', value: 'draft' },
                { text: 'Đang hoạt động', value: 'publish' },
            ],

            stages: [
                { text: 'Đang mở đăng ký', value: 'open' },
                { text: 'Đã đóng đăng ký', value: 'closed' },
                { text: 'Đang diễn ra', value: 'inprogress' },
                { text: 'Đã hoàn thành', value: 'completed' },
                { text: 'Đã hủy', value: 'cancelled' },
            ],

            //isUpdate
            countUpdate: 0,
        };
    },


    validations: {
        form: {
            name: {
                maxLength: helpers.withMessage("Tên khóa học tối da 60 ký tự", maxLength(60)),
                required: helpers.withMessage("Tên khóa học là bắt buộc", required),
            },
            original_price: {
                required: helpers.withMessage("Giá gốc là bắt buộc", function(){
                    return this._checkPriceZero(this.form.original_price)
                }),
                numeric_validate: helpers.withMessage("Bạn phải nhập số", function(){
                    return this._checkIsNumber(this.form.original_price)
                } ),
            },
            discounted_price: {
                required: helpers.withMessage("Giá giảm là bắt buộc", function(){
                    return this._checkPriceZero(this.form.discounted_price)
                }),
                numeric_validate: helpers.withMessage("Bạn phải nhập số", function(){
                    return this._checkIsNumber(this.form.discounted_price)
                } ),
                price_min: helpers.withMessage("Giá giảm phải nhỏ giá gốc", function () {
                    return this.checkDiscountedPrice()
                })
            },
            start_date: {
                required: helpers.withMessage("Ngày bắt đầu là bắt buộc", required),
            },
            end_date: {
                required: helpers.withMessage("Thời gian kết thúc là bắt buộc", required),
                end_date_min: helpers.withMessage("Vui lòng chọn thời gian ngày kết thúc lớn hơn ngày bắt đầu", function () {
                    return this.endDateState(this.form.start_date, this.form.end_date);
                })
            },
            start_time: {
                required: helpers.withMessage("Giờ bắt đầu là bắt buộc", required),
            },
            end_time: {
                required: helpers.withMessage("Giờ kết thúc là bắt buộc", required),
                end_time_min: helpers.withMessage("Giờ kết thúc phải lớn hơn giờ bắt đầu", function () {
                    return this.endTimeState()
                })
            },
            capacity: {
                maxValue: helpers.withMessage("Sức chứa tối đa là 1000", maxValue(1000)),
                required: helpers.withMessage("Sức chứa là bắt buộc", required),
                numeric: helpers.withMessage("Bạn phải nhập số", numeric),
                capacity_min: helpers.withMessage("Sức chứa phải lớn hơn hoặc bằng sức chứa ban đầu", function () {
                    return this._checkCapacity();
                }),
            },
            zone: {
                required: helpers.withMessage("Địa điểm là bắt buộc", required),
            },
            type: {
                required: helpers.withMessage("Loại là bắt buộc", required),
            },
            level: {
                required: helpers.withMessage("Mức độ là bắt buộc", required),
            },
            status: {
                required: helpers.withMessage("Trạng thái là bắt buộc", required),
            },
            stage: {
                required: helpers.withMessage("Tình trạng là bắt buộc", required),
            },
            method: {
                required: helpers.withMessage("Hình thức là bắt buộc", required),
            },
        },
    },

    components: {
        PageHeader,
        FadeContainer,
        CardReport,
        CountTo,
        NoresultTable,
        Pagination,
        Avatar,
        Text,
        FilterContainer,
        rightSidebarUpdate,
        ButtonHandle,
        flatPickr
    },
 
    methods: {

        //validations of method
        _checkPriceZero(value) {
            if(value == 0 ) return false
            return true
        },
        _checkIsNumber(value){
            if(isNaN(this._convertCurrencyToNumber(value))) return false
            return true
        },
        _convertCurrencyToNumber(currency) {
            return convertCurrencyToNumber(currency)
        },
        checkDiscountedPrice() {
            return Number(this._convertCurrencyToNumber( this.form.discounted_price)) <=Number(this._convertCurrencyToNumber( this.form.original_price))
        },
        endDateState(start, end) {
            return new Date(end) > new Date(start) ? true : false
        },
        endTimeState() {
            const date1 = new Date();
            const [hours1, minutes1] = this.form.start_time.split(":");
            date1.setHours(hours1);
            date1.setMinutes(minutes1);

            const date2 = new Date();
            const [hours2, minutes2] = this.form.end_time.split(":");
            date2.setHours(hours2);
            date2.setMinutes(minutes2);

            const result = date1 - date2;
            if (result > 0) return false
            return true
        },
        _checkCapacity() {
            return this.form.capacity >= this.info_detail.capacity
        },
        _updateDiscountedPrice(value) {
            if(this._convertNumber(this._convertCurrencyToNumber(value))== 'NaN') return value
            return this._convertNumber(this._convertStringToNumber(value))
        },
        _convertDateToTimestamp(date) {
            return convertDateToTimestamp(date)
        },
        

        //lodash
        _isEmpty(item) {
            return _isEmpty(item)
        },

        //method medium
        _convertNumber(number) {
            return convertNumber(number)
        },
        _convertStringToNumber(string) {
            return convertStringToNumber(string)    
        },

        percent_capacity(value1, value2){
            var percent = (Number(value1) - Number(value2));
            var result = Math.abs((percent / value2)) * 100;

            if (value2 == 0 || !value2)
            {
                return "warning"
            }

            if (!percent)
            {
                return "warning"
            }

            if(result > 0 && result <= 25)
            {
                return "success"
            }

            if(result > 25 && result < 50)
            {
                return "info"
            }

            
            if(result >= 50 && result <= 75)
            {
                return "warning"
            }

            if(result > 75 )
            {
                return "danger"
            }


        },

        handleDelete(value) {
        
            Swal.fire({
                title: "Xóa khóa học?",
                text: "Bạn có chắc sẽ khóa khóa học này khỏi hệ thống?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#f46a6a",
                confirmButtonColor: "#34c38f",
                cancelButtonText: "Hủy",
                confirmButtonText: "Đồng ý",
            }).then(async (result) => {
                if (result.value) {
                    await CourseService.removeCourse(value.id)
                    await this.getDataTable()
                    // Swal.fire("Đã xóa!", `Bạn đã xóa khóa học khỏi hệ thống.`, "success");
                }
            });
        },

        async getDataTable() {
            this.isLoading = true;
            this.items_data_table = await CourseService.getCourses({
                filters: this.filters,
                orders: this.orders,
                pagination: {
                    page: this.currentPage,
                    limit: this.page.per_page
                }
            })

            this.page.per_page = get(this.items_data_table, 'data.per_page', 25)
            this.page.total = get(this.items_data_table, 'data.total', 0)
            this.page.from = get(this.items_data_table, 'data.from', 0)
            this.page.to = get(this.items_data_table, 'data.to', 0)

            this.isLoading = false;

        },

        async fetchDataStatistic() 
        {
            this.isLoadingStatistic = true;
            this.items_data_statistic = await CourseService.getstatistic()

            this.isLoadingStatistic = false;

        },

        async setPage(value) 
        {
            this.currentPage = value
        },

        mergeArray(array1, array2)
        {

            return array1.map(item1 => {
                const matchingItem = array2.find(item2 => item2.name === item1.name);
                if (matchingItem) {
                    return {
                        name: item1.name,
                        value: matchingItem.value
                    };
                } 
                else 
                {
                    return item1;
                }
            }).concat(array2.filter(item2 => !array1.some(item1 => item1.name === item2.name)));

        },
   
        setFilters(value) {
            this.filters = value.filters

            this.orders = this.mergeArray([
                {
                    name: "created_at",
                    value: "desc"
                },
            ],value.orders._rawValue)


            if( get(this.items_data_table, "message")=="NO_CONTENT")
            {
                this.page.per_page = 25
            }

            if(value.callApi)
            {
                this.getDataTable()
            }
        },

        async onOpenForm(value) {
            this.isLoadingInfoDetail = true
            const response = await CourseService.getCourseDetail(value.id)
            this.info_detail = {
                ...value,
                capacity: this.get(value, 'capacity.total'),
            }

            this.isLoadingInfoDetail = false
            if(response.data)
            {
                this.form_temp = response.data
                this.form = {
                    id: this.get(this.form_temp, 'id'),
                    name: this.get(this.form_temp, 'name'),
                    description: this.get(this.form_temp, 'description', ''),
                    code: this.get(this.form_temp, 'code'),
                    unit: this.get(this.form_temp, 'unit'),
                    original_price: this._convertNumber(this.get(this.form_temp, 'original_price')),
                    discounted_price: this._convertNumber(this.get(this.form_temp, 'discounted_price')),
                    sale_price: this.get(this.form_temp, 'sale_price'),
                    start_date: this.moment(this.get(this.form_temp, 'start_date') * 1000).format('YYYY-MM-DD'),
                    end_date: this.moment(this.get(this.form_temp, 'end_date') * 1000).format('YYYY-MM-DD'),
                    start_time: this.get(this.form_temp, 'start_time'),
                    end_time: this.get(this.form_temp, 'end_time'),
                    capacity: this.get(this.form_temp, 'capacity'),
                    zone: this.get(this.form_temp, 'zone'),
                    type: this.get(this.form_temp, 'type'),
                    level: this.get(this.form_temp, 'level'),
                    status: this.get(this.form_temp, 'status'),
                    stage: this.get(this.form_temp, 'stage'),
                    method: this.get(this.form_temp, 'method'),
                }

                this.updateSidebarModal = true
            }
        },
        onCloseForm() {
            this.updateSidebarModal = false
        },
       

        async updateCourse() {
            this.isLoadingUpdate = true
            this.validator.form.$validate()
            if(this.validator.form.$invalid) return 
            const convertDate = {
                ...this.form,
                description: this._isEmpty(this.form.description) ? '' : this.form.description,
                start_date: this._convertDateToTimestamp(this.form.start_date),
                end_date: this._convertDateToTimestamp(this.form.end_date),
                original_price: this._convertCurrencyToNumber(this.form.original_price),
                discounted_price: this._convertCurrencyToNumber(this.form.discounted_price),
            }
            await CourseService.updateCourse(this.form.id, convertDate)
            this.isLoadingUpdate = false
            await this.getDataTable()
            this.onCloseForm()
        },

        onSubmit() {
            this.validator.$validate()
            if (this.validator.$invalid) return
            if (!this.endDateState(this.form.start_date, this.form.end_date) || !this.endTimeState()) return getToastError('Thời gian cập nhật của bạn không hợp lệ')

            this.updateCourse()
        },
    },


    watch: {
        "currentPage"() 
        {
            this.getDataTable();
        },

        
        "page.per_page"() {
            if (!this.items_data_table || get(this.items_data_table, "message")=="NO_CONTENT") {
                return
            }
            this.getDataTable();
        },

        updateSidebarModal: {
            deep: true,
            handler(newValue) {
                if(newValue === false){
                    this.countUpdate = 0
                }
            }
        },

        form: {
            deep: true,
            handler() {    
                if(this.updateSidebarModal === true){
                    this.countUpdate++ 
                }
            }
        }
        
    },

    async mounted() {
        await this.getDataTable()  
        await this.fetchDataStatistic()
    },

    computed: {
        data_table_result: {
            get() {
                return get(this.items_data_table,'data.data',[]).map(item => ({
                    ...item, action: item.code
                }))
            }
        }
    }
};
</script>

<template>
    <FadeContainer>
        <PageHeader title="Khóa học"  />
        <b-row>

            <b-col xl="4" md="12" >
                <CardReport title="Số lượng khóa học" sub_title="(Đang hoạt động / Tổng số)" :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_courses_publish', 0)" :duration="1000"></count-to>/
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_courses', 0)" :duration="1000"></count-to>
                    </template>
                    <template  #slot2>
                        <div class="flex-shrink-0 avatar-md">
                            <div class="avatar-title bg-soft-danger text-danger fs-22 rounded">
                            <i class="ri-shopping-bag-line"></i>
                            </div>
                        </div>
                    </template>

                </CardReport>
            </b-col>
            <b-col xl="4" md="12" >
                <CardReport title="Hình thức" sub_title="(Online - Offline)" :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_method_online', 0)" :duration="1000"></count-to>-
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_method_offline', 0)" :duration="1000"></count-to>
                    </template>
                    <template  #slot2>
                        <div class="flex-shrink-0 avatar-md">
                            <div class="avatar-title bg-soft-info text-info fs-22 rounded">
                                <i class="ri-funds-line"></i>
                            </div>
                        </div>
                    </template>

                </CardReport>
            </b-col>
            <b-col xl="4" md="12" >
                <CardReport title="Địa điểm" sub_title="(Hồ Chí Minh - Hà Nội)" :isLoading="isLoadingStatistic">
                    <template #slot1>
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_zone_hcm', 0)" :duration="1000"></count-to>-
                        <count-to :startVal="0" :endVal="get(items_data_statistic, 'data.total_zone_hn', 0)" :duration="1000"></count-to>
                    </template>
                    <template  #slot2>
                        <div class="flex-shrink-0 avatar-md">
                            <div class="avatar-title bg-soft-warning text-warning fs-22 rounded">
                                <i class="ri-building-4-line"></i>
                            </div>
                        </div>
                    </template>

                </CardReport>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="12">
                <b-card no-body id="invoiceList">
                    <b-card-header class="border-0">
                        <div class="d-flex align-items-center">
                            <h5 class="card-title mb-0 flex-grow-1">Danh sách khóa học</h5>
                            <router-link to="/courses/create">
                                <b-button variant="success" size="md">
                                    <i class="ri-add-line align-middle me-1"></i>
                                    Thêm
                                </b-button>
                            </router-link>
                        </div>
                    </b-card-header>
    
                    <b-card-body class="bg-soft-light border border-dashed border-start-0 border-end-0">
                        <FilterContainer :config="config_filter" @handleFilter="setFilters"/>
                    </b-card-body>
                    <b-card-body >
                        <b-table
                            v-if="isLoading"
                            sticky-header hover striped bordered responsive data-simplebar
                            style="height: calc(100vh - 328px)"
                            :fields="fields"
                            :items="Array(25).fill().map((item) => ({ code: item }))"
                        >
                            <template
                                v-for="(field, index) in fields"
                                :key="`${get(field, 'key')}${index}`"
                                v-slot:[`cell(${field.key})`]
                            >
                                <div class="placeholder placeholder-glow rounded w-100">
                                    &nbsp;
                                </div>
                            </template>
                        </b-table>
                        <b-table
                            v-else
                            sticky-header striped bordered responsive data-simplebar show-empty
                            :hover="!_isEmpty(data_table_result)"
                            :items="data_table_result"
                            :fields="fields"
                            style="height: 400px"
                        >
                            <template #empty>
                                <NoresultTable/>
                            </template>

                            <template #cell(code)="data">
                                <router-link :to="'/courses/' + get(data, 'item.id')" class="link-info">
                                   <Text :text="data.item.code"/>
                                </router-link>
                            </template>

                            <template #cell(name)="data">
                                <span  >
                                    {{ get(data, 'value') }}
                                </span>
                            </template>

                            <template #cell(type)="data">
                                <div class="d-flex align-items-center gap-2"
                                    :class="`${get(course_type, `${data.item.type}.class`)}`"
                                >
                                    <i :class="`${get(course_type, `${data.item.type}.icon`)}`"></i>
                                    {{ get(course_type, `${data.item.type}.label`) }}
                                </div>
                            </template>

                            <template #cell(level)="data">
                                <span class="badge rounded-pill p-1" :class="get(label_course, data.value+'.class', 'badge-outline-warning')">
                                    {{ get(label_course, data.value+'.text', 'Đang cập nhật') }}
                                </span>
                            </template>

                            <template #cell(zone)="data">
                                {{ get(zone_type, get(data, 'item.zone'), 'Đang cập nhật') }}
                            </template>

                            <template #cell(method)="data">
                                <span class="d-flex gap-1 text-start badge rounded-pill text-uppercase " :class="get(label_course, data.value+'.class', 'text-warning')">
                                    <span>
                                        <i :class=" get(label_course, data.value+'.icon', '')"></i>
                                    </span>
                                    <span>
                                        {{ get(label_course, data.value+'.text', 'Đang cập nhật') }}
                                    </span>
                                </span>
                            </template>

                            <template #cell(original_price)="data">
                                <span class="text-end ">
                                    {{ get(data, 'value',0).toLocaleString('vn') }}
                                </span>
                            </template>

                            <template #cell(discounted_price)="data">
                                <span class="text-end ">
                                    {{ get(data, 'value',0).toLocaleString('vn') }}
                                </span>
                            </template>
                            <template #cell(capacity)="data">
                                    <b-badge class="p-1" :variant="percent_capacity(get(data.value,'used',0), get(data.value,'total', 0))" pill>
                                        {{ get(data.value,'used',0) }}/{{ get(data.value,'total', 0) }}
                                    </b-badge>
                            </template>
                            <template #cell(instructor)="data">
                                <div class="d-flex align-items-center gap-2" v-if="get(data.value, 'display_name')">
                                    <Avatar size="xxs" :name="get(data.value, 'display_name', 'Đang cập nhật')" :src="get(data.value, 'avatar_url', '')"/>
                                    <Text :text="get(data.value, 'display_name', 'Đang cập nhật')"/>
                                </div>
                                <div v-else class="ps-1">
                                    --
                                </div>
                            </template>

                            <template #cell(stage)="data">
                                <b-badge 
                                    :variant="get(label_course,get(data, 'value', '') + '.class')" 
                                    pill 
                                >
                                    {{ get(label_course,get(data, 'value', '') + '.text') }}
                                </b-badge>
                            </template>
                           
                            <template #cell(start_date)="data">
                                <span >
                                    {{ moment(get(data, 'value', ) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                </span>
                            </template>

                            <template #cell(end_date)="data">
                                <span >
                                    {{ moment(get(data, 'value', ) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                </span>
                            </template>

                            <template #cell(status)="data">
                                <span class="badge rounded-pill text-uppercase p-1" :class="get(label_course, data.value+'.class', 'badge-soft-warning')">
                                    {{ get(label_course, data.value+'.text', 'Đang cập nhật') }}
                                    <!-- {{ data.value }} -->
                                </span>
                            </template>

                            <template #cell(created_at)="data">
                                <span >
                                    {{ moment(get(data, 'value', ) * 1000).format('DD/MM/YYYY') || '--/--/----' }}
                                </span>
                            </template>
                            
                            <template #cell(action)="data">

                                <ul class="list-inline hstack gap-2 mb-0 d-flex justify-content-center">
                                    <li class="list-inline-item" v-b-tooltip.hover="{title: 'Xem chi tiết'}">
                                        <router-link :to="'/courses/' + get(data, 'item.id')" class="text-primary d-inline-block">
                                        <i class="ri-eye-fill fs-16"></i>
                                        </router-link>
                                    </li>
                                    <li class="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover"
                                        data-bs-placement="top" v-b-tooltip.hover="{title: 'Sửa'}">
                              
                                        <span  class="text-primary cursor-pointer d-inline-block edit-item-btn"
                                            @click="onOpenForm(data.item)"
                                        >
                                            <i class="ri-pencil-fill fs-16"></i>
                                        </span>
                                    </li>
                                    <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
                                        data-bs-placement="top" v-b-tooltip.hover="{title: 'Xóa'}">
                                        <b-link class="text-danger d-inline-block remove-item-btn" @click="handleDelete(data.item)">
                                        <i class="ri-delete-bin-5-fill fs-16"></i>
                                        </b-link>
                                    </li>
                                </ul>
                            </template>
                        </b-table>
                        
                        <div class="d-flex justify-content-between align-items-center px-2">
                            <div>
                                <i>Hiển thị</i>
                                <div class="mx-2" style="display: inline-block; min-width: 50px">
                                    <b-form-select
                                        class="text-size bg-light border-0"
                                        :disabled="isLoading"
                                        v-model="page.per_page"
                                    >
                                        <b-form-select-option :value="25">25</b-form-select-option>
                                        <b-form-select-option :value="50">50</b-form-select-option>
                                        <b-form-select-option :value="100">100</b-form-select-option>
                                        <b-form-select-option :value="200">200</b-form-select-option>
                                    </b-form-select>
                                </div>
                                <i>
                                    khóa học từ <b>{{ page.from }}</b>-<b>{{ page.to }}</b>
                                    trên tổng số <b>{{ page.total }}</b> khóa học
                                </i>
                            </div>
                            <div>
                                <Pagination
                                    :currentPage="currentPage" 
                                    @update:currentPage="currentPage = $event" 
                                    :rows="Number(page.total)" 
                                    :perPage="page.per_page"
                                    :is_disabled="isLoading"
                                /> 
                            </div>
                        </div>
                   
    
                </b-card-body>
            </b-card>
        </b-col>
        </b-row>
    </FadeContainer>
  
    <right-sidebar-update title="Cập nhật khóa học" width="70%" :updateSidebarModal="updateSidebarModal"
        @update:updateSidebarModal="updateSidebarModal = $event">
        <b-form @submit="onSubmit">
            <div data-simplebar style="max-height: calc(100vh - 170px);" class="mb-4 p-3">
                <h6>
                    Thông tin cơ bản
                </h6>
                <b-row>
                    <!-- <b-col lg="4">
                        <b-form-group id="input-group-code" label="Mã khóa học:" label-for="input-code">
                            <b-form-input id="input-code" v-model="form.code" placeholder="Nhập mã" required>
                            
                            </b-form-input>
                        </b-form-group>
                    </b-col> -->
                    <b-col lg="4">
                        <div class="d-flex justify-content-between">
                            <label for="input-name" class="">Tên khóa học:</label>
                            <span class="text-muted fs-12 mt-1">
                                {{form.name.length}}/60
                            </span>
                        </div>
                        <b-form-input id="input-name" v-model="form.name" placeholder="Nhập tên khóa học"
                            :class="{ 'is-invalid': validator.form.name.$invalid }"
                            @input="validator.form.name.$touch()" @blur="validator.form.name.$touch()">

                        </b-form-input>
                        <div class="invalid-feedback" v-for="(item, index) in validator.form.name.$errors" :key="index">

                            {{ item.$message }}
                        </div>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-capacity" label="Sức chứa:" label-for="input-capacity">
                            <b-form-input id="input-capacity" v-model="form.capacity" placeholder="Nhập sức chứa"
                                :class="{ 'is-invalid': validator.form.capacity.$invalid }"
                                @input="validator.form.capacity.$touch()" @blur="validator.form.capacity.$touch()">

                            </b-form-input>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.capacity.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-zone" label="Địa điểm:" label-for="input-zone">
                            <b-form-select id="input-zone" v-model="form.zone" :options="zones"
                                :class="{ 'is-invalid': validator.form.zone.$invalid }"
                                @change="validator.form.zone.$touch()"></b-form-select>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.zone.$errors" :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-type" label="Loại:" label-for="input-type">
                            <b-form-select id="input-type" v-model="form.type" :options="types"
                                :class="{ 'is-invalid': validator.form.type.$invalid }"
                                @change="validator.form.type.$touch()"></b-form-select>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.type.$errors" :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-level" label="Mức độ:" label-for="input-level">
                            <b-form-select id="input-level" v-model="form.level" :options="levels"
                                :class="{ 'is-invalid': validator.form.level.$invalid }"
                                @change="validator.form.level.$touch()"></b-form-select>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.level.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-status" label="Trạng thái:" label-for="input-status">
                            <b-form-select id="input-status" v-model="form.status" :options="statuss"
                                :class="{ 'is-invalid': validator.form.status.$invalid }"
                                @change="validator.form.status.$touch()"></b-form-select>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.status.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-stage" label="Tình trạng:" label-for="input-stage">
                            <b-form-select id="input-stage" v-model="form.stage" :options="stages"
                                :class="{ 'is-invalid': validator.form.stage.$invalid }"
                                @change="validator.form.stage.$touch()"></b-form-select>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.stage.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-method" label="Hình thức:" label-for="input-method">
                            <b-form-select id="input-method" v-model="form.method" :options="methods"
                                :class="{ 'is-invalid': validator.form.method.$invalid }"
                                @change="validator.form.method.$touch()"></b-form-select>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.method.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
                <h6>Giá khóa học:</h6>
                <b-row>
                    <b-col lg="6">
                        <b-form-group id="input-group-original_price" label="Giá gốc:" label-for="input-original_price">
                            <b-form-input id="input-original_price" v-model="form.original_price" placeholder="Nhập giá"
                                :class="{ 'is-invalid': validator.form.original_price.$invalid }"
                                :formatter="_updateDiscountedPrice"
                                @input="validator.form.original_price.$touch()"
                                @blur="validator.form.original_price.$touch()">

                            </b-form-input>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.original_price.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="6">
                        <b-form-group id="input-group-discounted_price" label="Giá đã giảm:"
                            label-for="input-discounted_price">
                            <b-form-input id="input-discounted_price" placeholder="Nhập giá"
                                v-model="form.discounted_price"
                                :formatter="_updateDiscountedPrice"
                                :class="{ 'is-invalid': validator.form.discounted_price.$invalid }"
                                @input="validator.form.discounted_price.$touch()" 
                                @blur="validator.form.discounted_price.$touch()"
                                >

                            </b-form-input>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.discounted_price.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
                <h6>Thời gian:</h6>
                <b-row>
                    <b-col lg="6">
                        <b-form-group id="input-group-start_date" label="Ngày bắt đầu:" label-for="input-start_date">
                            <!-- <b-form-input id="input-start_date" v-model="form.start_date" placeholder="Nhập giá" type="date"
                                :class="{ 'is-invalid': validator.form.start_date.$invalid }"
                                @input="validator.form.start_date.$touch()"
                                @blur="validator.form.start_date.$touch()"
                            >
                            
                            </b-form-input> -->
                            <flat-pickr v-model="form.start_date" :config="config" class="form-control"
                                placeholder="Chọn ngày bắt đầu" name="start_date"
                                :class="{ 'is-invalid': validator.form.start_date.$invalid }"
                                @change="validator.form.start_date.$touch()" />
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.start_date.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="6">
                        <b-form-group id="input-group-end_date" label="Ngày kết thúc:" label-for="input-end_date">
                            <!-- <b-form-input id="input-end_date" v-model="form.end_date" placeholder="Nhập giá" type="date"
                                aria-describedby="input-end_date-feedback"
                                :class="{ 'is-invalid': validator.form.end_date.$invalid }"
                                @input="validator.form.end_date.$touch()"
                                @blur="validator.form.end_date.$touch()"
                            >
                            
                            </b-form-input> -->
                            <flat-pickr v-model="form.end_date" :config="config" class="form-control is-invalid"
                                placeholder="Chọn ngày kết thúc" name="end_date" v-if="validator.form.end_date.$invalid"
                                @change="validator.form.end_date.$touch()" />
                            <flat-pickr v-model="form.end_date" :config="config" class="form-control"
                                placeholder="Chọn ngày kết thúc" name="end_date" v-else
                                @change="validator.form.end_date.$touch()" />
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.end_date.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="6">
                        <b-form-group id="input-group-start_time" label="Giờ bắt đầu:" label-for="input-start_time">
                            <b-form-input id="input-start_time" v-model="form.start_time" placeholder="Nhập giá" type="time"
                                :class="{ 'is-invalid': validator.form.start_time.$invalid }"
                                @change="validator.form.start_time.$touch()">

                            </b-form-input>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.start_time.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="6">
                        <b-form-group id="input-group-end_time" label="Giờ kết thúc:" label-for="input-end_time">
                            <b-form-input id="input-end_time" v-model="form.end_time" placeholder="Nhập giá" type="time"
                                aria-describedby="input-end_time-feedback"
                                :class="{ 'is-invalid': validator.form.end_time.$invalid }"
                                @change="validator.form.end_time.$touch()">

                            </b-form-input>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.end_time.$errors"
                                :key="index">

                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-form-group id="input-group-description" label="Mô tả:" label-for="input-description">
                    <b-form-textarea id="textarea" v-model="form.description" placeholder="Mô tả..." rows="3"
                        max-rows="6"></b-form-textarea>
                </b-form-group>
            </div>
            {{ isUpdate }}
            <ButtonHandle type="submit" label="Cập nhật khóa học" :isLoading="isLoadingUpdate" :is_disabled="countUpdate <= 1" />
        </b-form>
    </right-sidebar-update>
   
</template>
