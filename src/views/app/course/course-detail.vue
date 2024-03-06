<script>
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'

import moment from 'moment';

import {
    required,
    helpers,
    numeric,
    maxLength,
    maxValue
} from "@vuelidate/validators";
import useVuelidate from '@vuelidate/core';

import { convertDateToTimestamp, convertNumber, convertStringToNumber, convertCurrencyToNumber } from '../../../helpers/utils';
import levelType from '../../../config/type/course-level'
import courseTyp from '../../../config/type/course-typ';
import zoneType from '../../../config/type/zone-type';

import FadeContainer from "@/components/ui/fade-container.vue";
import TabOverview from '../../../components/page/course/course-detail/tab-overview.vue';
import TabLessonList from '../../../components/page/course/course-detail/tab-lesson-list.vue';
import CourseService from '../../../services/course.service'
import TabCustomer from '../../../components/page/course/course-detail/tab-customer.vue';
import TabOrder from '../../../components/page/course/course-detail/tab-order.vue';
import PlaceholderWraper from '../../../components/ui/placeholder-wraper.vue';
import Text from '../../../components/ui/text.vue';
import rightSidebarUpdate from '../../../components/ui/modal/right-sidebar-update.vue';
import ButtonHandle from '../../../components/ui/button-handle.vue';
import { getToastError } from '../../../helpers/toast';
import Avatar from '../../../components/ui/avatar/avatar.vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/l10n/vn';

export default {
    data() {
        return {
            isLoadingDetail: false,
            isLoadingUpdate: false,
            info_detail: {},
            levelType,
            updateSidebarModal: false,
            validator: useVuelidate(),
            config: {
                wrap: true, // set wrap to true only when using 'input-group'
                altFormat: 'd/m/Y',
                altInput: true,
                // dateFormat: 'Y-m-d',
                locale: 'vn',
            },
            form: {
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
            courseTyp,
            zoneType,
            tab: sessionStorage.getItem('course_detail_tab') || 'overview',
            isEdit: false,
            isStartDateChange: false,
        }
    },
    components: {
        FadeContainer,
        TabOverview,
        TabLessonList,
        TabCustomer,
        TabOrder,
        PlaceholderWraper,
        Text,
        rightSidebarUpdate,
        ButtonHandle,
        Avatar,
        flatPickr,
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

    computed: {
        formattedDiscountedPrice: {
            get() {
                return this._convertNumber(this.form.discounted_price)
            }
        }
    },

    mounted() {
        this.getCouresDetail()
    },

    unmounted() {
        sessionStorage.removeItem('course_detail_tab')
    },
    
    watch: {
        tab: function (value) {
            sessionStorage.setItem('course_detail_tab', value)
        },
        updateSidebarModal: function (value) {
           if(value === false){
               this.isEdit = false
               this.isStartDateChange = false
               this.form = {
                    name: this._get(this.info_detail, 'name'),
                    description: this._get(this.info_detail, 'description', ''),
                    code: this._get(this.info_detail, 'code'),
                    unit: this._get(this.info_detail, 'unit'),
                    original_price: this._convertNumber(this._get(this.info_detail, 'original_price')),
                    discounted_price: this._convertNumber(this._get(this.info_detail, 'discounted_price')),
                    sale_price: this._get(this.info_detail, 'sale_price'),
                    start_date: this._moment(this._get(this.info_detail, 'start_date') * 1000).format('YYYY-MM-DD'),
                    end_date: this._moment(this._get(this.info_detail, 'end_date') * 1000).format('YYYY-MM-DD'),
                    start_time: this._get(this.info_detail, 'start_time'),
                    end_time: this._get(this.info_detail, 'end_time'),
                    capacity: this._get(this.info_detail, 'capacity'),
                    zone: this._get(this.info_detail, 'zone'),
                    type: this._get(this.info_detail, 'type'),
                    level: this._get(this.info_detail, 'level'),
                    status: this._get(this.info_detail, 'status'),
                    stage: this._get(this.info_detail, 'stage'),
                    method: this._get(this.info_detail, 'method'),
                }
           }
        },

        form: {
            handler() {
                if(this.updateSidebarModal === true){
                    this.isEdit = true
                }
            },
            deep: true
        }, 
    },

    methods: {
        _moment(date) {
            return moment(date)
        },

        _get(item, ref, auto = null) {
            return _get(item, ref, auto)
        },

        _isEmpty(item) {
            return _isEmpty(item)
        },

        _convertDateToTimestamp(date) {
            return convertDateToTimestamp(date)
        },

        _convertNumber(number) {
            return convertNumber(number)
        },

        _convertStringToNumber(string) {
            return convertStringToNumber(string)
        },

        _convertCurrencyToNumber(currency) {
            return convertCurrencyToNumber(currency)
        },
        _checkCapacity() {
            return this.form.capacity >= this.info_detail.capacity
        },

        _updateDiscountedPrice(value) {
            if(this._convertNumber(this._convertCurrencyToNumber(value))== 'NaN') return value
            return this._convertNumber(this._convertStringToNumber(value))
        },

        checkDiscountedPrice() {
            return Number(this._convertCurrencyToNumber( this.form.discounted_price)) <=Number(this._convertCurrencyToNumber( this.form.original_price))
        },

        _checkIsNumber(value){
            if(isNaN(this._convertCurrencyToNumber(value))) return false
            return true
        },

        _checkPriceZero(value) {
            if(value == 0 ) return false
            return true
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
            await CourseService.updateCourse(this.$route.params.id, convertDate)
            this.isLoadingUpdate = false
            await this.getCouresDetail()
            this.onCloseForm()
        },

        async getCouresDetail() {
            this.isLoadingDetail = true
            const res = await CourseService.getCourseDetail(this.$route.params.id)
            this.info_detail = _get(res, 'data', {})
            this.form = {
                name: this._get(this.info_detail, 'name'),
                description: this._get(this.info_detail, 'description', ''),
                code: this._get(this.info_detail, 'code'),
                unit: this._get(this.info_detail, 'unit'),
                original_price: this._convertNumber(this._get(this.info_detail, 'original_price')),
                discounted_price: this._convertNumber(this._get(this.info_detail, 'discounted_price')),
                sale_price: this._get(this.info_detail, 'sale_price'),
                start_date: this._moment(this._get(this.info_detail, 'start_date') * 1000).format('YYYY-MM-DD'),
                end_date: this._moment(this._get(this.info_detail, 'end_date') * 1000).format('YYYY-MM-DD'),
                start_time: this._get(this.info_detail, 'start_time'),
                end_time: this._get(this.info_detail, 'end_time'),
                capacity: this._get(this.info_detail, 'capacity'),
                zone: this._get(this.info_detail, 'zone'),
                type: this._get(this.info_detail, 'type'),
                level: this._get(this.info_detail, 'level'),
                status: this._get(this.info_detail, 'status'),
                stage: this._get(this.info_detail, 'stage'),
                method: this._get(this.info_detail, 'method'),
            }

            this.isLoadingDetail = false
        },



        onOpenForm() {
            this.updateSidebarModal = true
        },
        onCloseForm() {
            this.updateSidebarModal = false
        },

        onSubmit() {
            this.isStartDateChange = true
            this.validator.$validate()
            if (this.validator.$invalid) return
            if (!this.endDateState(this.form.start_date, this.form.end_date) || !this.endTimeState()) return getToastError('Thời gian cập nhật của bạn không hợp lệ')

            this.updateCourse()
        },

        async reCallAPIGetDataDetail(value){
            if(value.reCallAPIGetDataDetail)
            {
                await this.getCouresDetail()

            }
        },

        setTab(value)
        {
            this.tab = value
        },
    },

};
</script>

<template>
    <FadeContainer>
        <div class="profile-foreground position-relative mx-n4 mt-n4">
            <div class="profile-wid-bg">
                <img src="@/assets/images/profile-bg.jpg" alt="" class="profile-wid-img" />
            </div>
        </div>
        <div class="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <b-row class="g-4">
                <b-col cols="auto">
                    <avatar size="lg" thumbnail :src="_get(courseTyp, _get(info_detail, 'type') + '.logo')"
                        :name="_get(info_detail, 'name', '')" />
                </b-col>
                <b-col>
                    <div class="p-2">
                        <placeholder-wraper :isLoading="isLoadingDetail">
                            <h3 class="text-white mb-1">
                                <Text :text="_get(info_detail, 'name', '')" />
                            </h3>
                        </placeholder-wraper>
                        <placeholder-wraper :isLoading="isLoadingDetail">
                            <p class="text-white-75">
                                <Text :text="_get(levelType, _get(info_detail, 'level', ''))" />
                            </p>
                        </placeholder-wraper>
                        <div class="hstack text-white-50 gap-1">
                            <div class="me-2 d-flex align-items-center">
                                <i class="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                <placeholder-wraper :isLoading="isLoadingDetail">
                                    <Text :text="_get(zoneType, _get(info_detail, 'zone', ''))" />
                                </placeholder-wraper>
                            </div>
                            <div>
                                <i class="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>Ads Plus
                            </div>
                        </div>
                    </div>
                </b-col>
                <!-- <b-col cols="12" lg="auto" class="order-last order-lg-0">
                    <b-row class="text text-white-50 text-center">
                        <b-col lg="6" cols="4">
                            <div class="p-2">
                                <h4 class="text-white mb-1">24.3K</h4>
                                <p class="fs-14 mb-0">Followers</p>
                            </div>
                        </b-col>
                        <b-col lg="6" cols="4">
                            <div class="p-2">
                                <h4 class="text-white mb-1">1.3K</h4>
                                <p class="fs-14 mb-0">Following</p>
                            </div>
                        </b-col>
                    </b-row>
                </b-col> -->
            </b-row>
        </div>

        <b-row>
            <b-col lg="12">
                <div>
                    <div class="d-flex profile-wrapper">
                        <ul class="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                            <li class="nav-item">
                                <b-link 
                                    class="nav-link fs-14" data-bs-toggle="tab" href="#overview-tab" role="tab"
                                    :class="{'active': tab === 'overview'}"
                                    @click="setTab('overview')"
                                >
                                    <i class="ri-airplay-fill d-inline-block d-md-none"></i>
                                    <span class="d-none d-md-inline-block" >Tổng quan</span>
                                </b-link>
                            </li>
                            <li class="nav-item">
                                <b-link 
                                    class="nav-link fs-14" data-bs-toggle="tab" href="#activities" role="tab" 
                                    :class="{
                                        'active': tab === 'tabLession'
                                    }"
                                    @click="setTab('tabLession')"
                                >
                                    <i class="ri-list-unordered d-inline-block d-md-none"></i>
                                    <span class="d-none d-md-inline-block"  >Buổi học</span>
                                </b-link>
                            </li>
                            <li class="nav-item">
                                <b-link 
                                    class="nav-link fs-14" data-bs-toggle="tab" href="#projects" role="tab"  
                                    :class="{
                                        'active': tab === 'tabManageCustomer'
                                    }"
                                    @click="setTab('tabManageCustomer')"
                                >
                                    <i class="ri-price-tag-line d-inline-block d-md-none"></i>
                                    <span class="d-none d-md-inline-block">Danh sách học viên</span>
                                </b-link>
                            </li>
                            <li class="nav-item">
                                <b-link 
                                    class="nav-link fs-14" data-bs-toggle="tab" href="#documents" role="tab"
                                    :class="{
                                        'active': tab === 'tabManageBooking'
                                    }"
                                    @click="setTab('tabManageBooking')"
                                >
                                    <i class="ri-folder-4-line d-inline-block d-md-none"></i>
                                    <span class="d-none d-md-inline-block">Quản lý đơn đặt lịch</span>
                                </b-link>
                            </li>
                        </ul>
                        <!-- <div class="flex-shrink-0">
                            <div class="btn btn-success"><i class="ri-edit-box-line align-bottom"></i> Edit Profile</div>
                        </div> -->
                    </div>
                    <div class="tab-content pt-4 text-muted">
                        <div 
                            v-if="tab == 'overview'"
                            :class="{'active' : tab == 'overview'}"
                        >
                            <tab-overview :detail="info_detail" :isLoadingDetail="isLoadingDetail"
                                @onOpenForm="onOpenForm" @onCloseForm="onCloseForm"
                            />
                        </div>
                        <div 
                            v-if="tab == 'tabLession'"
                            :class="{'active' : tab == 'tabLession'}"
                        >
                            <tab-lesson-list :info_detail="info_detail" @reCallAPIGetDataLession="reCallAPIGetDataLession"/>
                        </div>
                        <div      
                            v-if="tab == 'tabManageCustomer'"
                            :class="{'active' : tab == 'tabManageCustomer'}" 
                        >
                            <tab-customer />
                        </div>
                        <div 
                            v-if="tab == 'tabManageBooking'"
                            :class="{'active' : tab == 'tabManageBooking'}" 
                        >
                            <tab-order />
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>
    </FadeContainer>
    <right-sidebar-update title="Cập nhật khóa học" width="70%" :updateSidebarModal="updateSidebarModal"
        @update:updateSidebarModal="updateSidebarModal = $event">
        <b-form @submit.prevent="onSubmit">
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
                            <flat-pickr v-model="form.start_date" 
                                :config="config"
                                class="form-control"
                                placeholder="Chọn ngày bắt đầu" name="start_date"
                                :class="{ 'is-invalid': validator.form.start_date.$invalid && isStartDateChange }"
                                @change="validator.form.start_date.$touch()" 
                                
                            />
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
                            <flat-pickr v-model="form.end_date" :config="{
                                    ...config,
                                    minDate: form.start_date
                                }" class="form-control is-invalid"
                                placeholder="Chọn ngày kết thúc" name="end_date" v-if="validator.form.end_date.$invalid"
                                @change="validator.form.end_date.$touch()" />
                            <flat-pickr v-model="form.end_date" :config="{
                                    ...config,
                                    minDate: form.start_date
                                }" class="form-control"
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

            <ButtonHandle type="submit" label="Cập nhật khóa học" :isLoading="isLoadingUpdate" :is_disabled="!isEdit" />
        </b-form>
    </right-sidebar-update>
</template>
