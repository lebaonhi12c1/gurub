
<script>

import fadeContainer from '../../../../ui/fade-container.vue'
import CourseService from '../../../../../services/course.service'

import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import { checkEmpty } from '../../../../../helpers/utils'

import moment from 'moment'

import {
    required,
    helpers,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { convertDateToTimestamp, convertCurrencyToNumber } from '../../../../../helpers/utils';
import { getToastError } from '../../../../../helpers/toast';
import ButtonHandle from '../../../../ui/button-handle.vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/l10n/vn';
import Swal from 'sweetalert2'
export default {
    components: { 
        fadeContainer,
        ButtonHandle,
        flatPickr
    },

    data() {
        return {
            isLoadingCategories: false,
            isLoadingTopics: false,
            isLoadingCreate: false,
            validator: useVuelidate(),
            form: JSON.parse(sessionStorage.getItem('form_create_coures_time')) || {
                start_date: new Date(),
                end_date: new Date(moment().clone().add(1, 'days')),
                start_time: this._moment(new Date()).format('HH:mm'),
                end_time: this._moment(new Date()).add(90, 'minutes').format('HH:mm'),
                category: '',
                lessions: [],
            },
            
            config: {
                wrap: true, // set wrap to true only when using 'input-group'
                altFormat: 'd/m/Y',
                altInput: true,
                dateFormat: 'Y-m-d',
                locale: 'vn',
            },
            date_option: 'fill',
            time_option: 'fill',
            date_options: [
                { text: 'Nhập thủ công', value: 'fill' },
                { text: '14 Ngày', value: '14' },
                { text: '30 Ngày', value: '30' },
            ],

            time_options: [
                { text: 'Nhập thủ công', value: 'fill' },
                { text: '1 giờ 30 phút', value: '90' },
                { text: '2 giờ 30 phút', value: '150' },
            ],
            categories: [],
            fields: [
                {
                    key: 'start_date',
                    label: 'Thời gian',
                    thClass: ' bg-primary text-white text-nowrap'
                },
                {
                    key: 'end_date',
                    label: 'Ngày học',
                    thClass: ' bg-primary text-white text-nowrap'
                }, 
                {
                    key: 'name',
                    label: 'Tên buổi học',
                    thClass: ' bg-primary text-white text-nowrap'
                },
                {
                    key: 'theory_percent',
                    label: 'Lý thuyết(%)',
                    tdClass: 'text-end',
                    thClass: ' bg-primary text-white text-nowrap'
                },
                {
                    key: 'practice_percent',
                    label: 'Thực hành(%)',
                    tdClass: 'text-end',
                    thClass: ' bg-primary text-white text-nowrap'
                },
                {
                    key: 'actual_share_percent',
                    label: 'Chia sẻ(%)',
                    tdClass: 'text-end',
                    thClass: ' bg-primary text-white text-nowrap'
                },
            ],

            toggle_validate: false,
        }
    },

    validations: {
        form: {
            start_date:{
                required: helpers.withMessage("Ngày khai giảng là bắt buộc", required),
            },
            end_date:{
                required: helpers.withMessage("Ngày kết thúc là bắt buộc", required),
                min_date: helpers.withMessage("Ngày kết thúc không được nhỏ hơn ngày khai giảng", function(){
                    return this.endDateState(this.form.start_date, this.form.end_date);
                })
            },
            start_time:{
                required: helpers.withMessage("Thời gian bắt đầu là bắt buộc", required),
            },
            end_time:{
                required: helpers.withMessage("Thời gian kết thúc là bắt buộc", required),
                min_time: helpers.withMessage("Thời gian kết thúc không được nhỏ hơn Thời gian bắt đầu", function(){
                    return this.endTimeState( this.form.start_time, this.form.end_time);
                })
            },
            category:{
                required: helpers.withMessage("Danh mục là bắt buộc", required),
            },

            lessions: {
                $each: helpers.forEach({
                    start_date: {
                        required: helpers.withMessage('Vui lòng chọn ngày', required),
                    }
                })
            }
        }
    },

    methods: {
        _convertCurrencyToNumber(number){
            return convertCurrencyToNumber(number)
        },

        _get(item, ref, auto = null) {
            return _get(item, ref, auto)
        },
        _isEmpty(item) {
            return _isEmpty(item)
        },

        _checkEmpty(item) {
            return checkEmpty(item)
        },

        _moment(date) {
            return moment(date)
        },

        _convertDateToTimestamp(date){
            return convertDateToTimestamp(date)
        },

        async getCategoriesCourse() {
            this.isLoadingCategories = true
            const res = await CourseService.getCategories()
            this.categories = this._get(res, 'data',[]).map(item =>(
                {
                    text: (item.code || item.id) + ' - ' + item.name,
                    value: item.id
                }
            ))
            this.form.category = JSON.parse(sessionStorage.getItem('form_create_coures_time'))?.category || this._get(this.categories[0], 'value')
            this.isLoadingCategories = false
        },

        async getTopics(category_id) {
            this.isLoadingTopics = true
            const res = await CourseService.getCategoriesTopics(category_id)
            this.form.lessions = this._get(res, 'data',[]).map(item =>(
                {
                    // start_date: new Date(),
                    // end_date: new Date().setDate(new Date().getDate() + 1),
                    start_date: '',
                    end_date: '',
                    start_time: this._moment(new Date()).format('HH:mm'),
                    end_time: this._moment(new Date()).add(90, 'minutes').format('HH:mm'),
                    ...item,
                }
            ))
            this.toggle_validate = false
            this.isLoadingTopics = false
        },

        endDateState(start, end) {
            return new Date(end) > new Date(start) ? true : false
        },

        endTimeState(start, end) {
            const date1 = new Date();
            const [hours1, minutes1] =start.split(":");
            date1.setHours(hours1);
            date1.setMinutes(minutes1);

            const date2 = new Date();
            const [hours2, minutes2] = end.split(":");
            date2.setHours(hours2);
            date2.setMinutes(minutes2);

            const result = date1 - date2;
            if (result > 0) return false
            return true
        },

        handlePreStep() {
            this.$emit('nextStep', 1)
        },

        addDate(start_date, value) {
            const date = this._moment(start_date); // Replace '2022-01-01' with your desired date
            const newDate = date.add(value, 'days').format('YYYY-MM-DD');

            return newDate // Output: '2022-01-31'
        },

        addTime(start_time, value) {
            const [hour, minute] = start_time.split(':');
            const currentTime = new Date();
            currentTime.setHours(hour);
            currentTime.setMinutes(minute);
            currentTime.setMinutes(currentTime.getMinutes() + value);

            const newHour = currentTime.getHours();
            const newMinute = currentTime.getMinutes();

            const newTimeString = `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
            return newTimeString
        },

        
        async onSubmit(event) {
            event.preventDefault();
            this.validator.$validate()
            if(this.validator.$invalid) {
                this.toggle_validate = true
                return
            }
            if(!this.endDateState(this.form.start_date, this.form.end_date) || !this.endTimeState( this.form.start_time, this.form.end_time)) return getToastError("Thời gian của bạn không hợp lệ")

            const course_info = JSON.parse(sessionStorage.getItem('form_create_coures_info')) || {}
            const course_price = JSON.parse(sessionStorage.getItem('form_create_coures_price')) || {}
            const convertData = {
                ...this.form,
                start_date: this._convertDateToTimestamp(this.form.start_date),
                end_date: this._convertDateToTimestamp(this.form.end_date),
                course_category_id: this.form.category,
                lessions: this.form.lessions.map(item=>{
                    return {
                        ...item,
                        topic_id: item.id,
                        start_date: this._convertDateToTimestamp(this._moment(item.start_date).format('YYYY-MM-DD') + ' ' + item.start_time),
                        end_date: this._convertDateToTimestamp(this._moment(item.start_date).format('YYYY-MM-DD') + ' ' + item.end_time),
                        instructor_id: this._get(course_info, 'instructor_id.id',0),
                    }
                }),
                ...course_info,
                instructor_id: this._get(course_info, 'instructor_id',0) ? this._get(course_info, 'instructor_id',0) : 0,
                ...course_price,
                original_price: this._convertCurrencyToNumber(this._get(course_price, 'original_price')),
                discounted_price: this._convertCurrencyToNumber(this._get(course_price, 'discounted_price')),
            }
            this.isLoadingCreate = true
            // const res = await CourseService.createCourse(convertData)

            // if(_get(res, 'status') === 'success') {
            //     sessionStorage.removeItem('form_create_coures_info')
            //     sessionStorage.removeItem('form_create_coures_price')
            //     sessionStorage.removeItem('form_create_coures_time')
            //     this.$emit('nextStep', 3)
            //     this.isLoadingCreate = false
            //     return
            // }

            // this.isLoadingCreate = false
        },

        handleBtnBottom(value) {
            if (value == 'cancel') {
                Swal.fire({
                title: "Xác nhận huỷ thêm khoá học!",
                text: "Bạn có chắc sẽ hủy thêm khóa học này không?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#f46a6a",
                confirmButtonColor: "#34c38f",
                cancelButtonText: "Hủy",
                confirmButtonText: "Tiếp tục thêm",
            }).then((result) => {
                if (!result.isConfirmed)
                {
                    sessionStorage.removeItem('step_create_course')
                    sessionStorage.removeItem('form_create_coures_price')
                    sessionStorage.removeItem('form_create_coures_info')
                    sessionStorage.removeItem('form_create_coures_time')

                    this.$router.push({ path: '/courses' })
                    return
                }
            });
                return
            }

            if (value == 'saveAndExit') {
                this.$router.push({ path: '/courses' })
            }
        },

        convertLabelDate(value) {
            const is_valid = this._moment(value).isValid()
            if(is_valid) return this._moment(value).format('DD/MM/YYYY')
            return '--/--/----'
        },

    },

    mounted() {
        this.getCategoriesCourse()
    },

    computed: {
         bothValuesDate() {
            return [this.date_option, this.form.start_date];
        },
        bothValuesTime() {
            return [this.time_option, this.form.start_time];
        }
    },

    watch: {
        form: {
            handler(newValue) {
                sessionStorage.setItem('form_create_coures_time', JSON.stringify(newValue));
            },
            deep: true
        },
        bothValuesDate(newValues) {
            // Handle changes in bothValues
            const [date_option, start_date] = newValues;
            if (date_option == 'fill') return
            this.form.end_date = this.addDate(start_date, Number(date_option))
            // Do something with newValue1 and newValue2
        },

        bothValuesTime(newValues) {
            // Handle changes in bothValues
            const [time_option, start_time] = newValues;
            if (time_option == 'fill') return
            this.form.end_time = this.addTime(start_time, Number(time_option))
            // Do something with newValue1 and newValue2
        },

        'form.category': {
            
            handler(newValue) {
                this.getTopics(newValue)
            },
            deep: true
        },

        'form.start_time': {
            handler(newValue) {
                this.form.lessions = this.form.lessions?.map(item =>{
                    return {
                        ...item,
                        start_time: newValue
                    }
                })
            },
            deep: true
        },

        'form.end_time': {
            handler(newValue) {
                this.form.lessions = this.form.lessions?.map(item =>{
                    return {
                        ...item,
                        end_time: newValue
                    }
                })
            },
            deep: true
        }
        
    },


}
</script>

<template>
    <fade-container>
        <div class="tab-pane fade show active" id="pills-bill-info" role="tabpanel" aria-labelledby="pills-bill-info-tab">
            <div>
                <h5 class="mb-1">Thời gian khóa học</h5>
             
                <p class="text-muted mb-4">
                    Đặt ngày khai giảng, ngày kết thúc để hoàn thành bước này  
                </p>
            </div>
            <b-form @submit="onSubmit">
                <b-row>
                    <b-col lg="4">
                        <b-form-group id="input-group-date_option" label="Tùy chỉnh Ngày:" label-for="input-date_option">
                            <b-form-select id="input-date_option" v-model="date_option" :options="date_options"
                                required></b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-start_date" label="Ngày khai giảng:" label-for="input-start_date">
                            <!-- <b-form-input id="input-start_date" type="date" min="0" v-model="form.start_date"
                                placeholder="Chọn ngày khai giảng" required>

                            </b-form-input> -->
                            <flat-pickr
                                v-model="form.start_date"
                                :config="config"
                                class="form-control"
                                placeholder="Chọn ngày khai giảng bắt đầu"
                                name="start_date"
                                :class="{ 'is-invalid': validator.form.start_date.$errors.length > 0 }"
                                @change="validator.form.start_date.$touch()"
                            /> 
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.start_date.$errors" :key="index">
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-end_date" label="Ngày kết thúc:" label-for="input-end_date">
                            <!-- <b-form-input id="input-end_date" type="date" min="0" v-model="form.end_date"
                                placeholder="Chọn ngày kết thúc" required aria-describedby="input-end_date-feedback"
                                :state="endDateState(form.start_date, form.end_date)" :disabled="date_option != 'fill'">

                            </b-form-input>
                            <b-form-invalid-feedback id="input-end_date-feedback">
                                Ngày kết thúc không được nhỏ hơn ngày khai giảng
                            </b-form-invalid-feedback> -->
                            <flat-pickr
                                v-model="form.end_date"
                                :config="{
                                    ...config,
                                    minDate: new Date(Date.parse(_moment(form.start_date).clone().add(1, 'days').startOf('day'))),
                                }"
                                class="form-control"
                                placeholder="Chọn ngày kết thúc"
                                name="end_date"
                                :class="{ 'is-invalid': validator.form.end_date.$errors.length > 0 }"
                                @change="validator.form.end_date.$touch()"
                            /> 
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.end_date.$errors" :key="index">
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="4">
                        <b-form-group id="input-group-time_option" label="Tùy chỉnh giờ:" label-for="input-time_option">
                            <b-form-select id="input-time_option" v-model="time_option" :options="time_options"
                                required>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-start_time" label="Giờ bắt đầu:" label-for="input-start_time">
                            <b-form-input id="input-start_time" type="time" min="0" v-model="form.start_time"
                                placeholder="Chọn giờ bắt đầu" required>

                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-end_time" label="Giờ kết thúc:" label-for="input-end_time">
                            <b-form-input id="input-end_time" type="time" min="0" v-model="form.end_time"
                                placeholder="Chọn giờ kết thúc"
                                :class="{ 'is-invalid': validator.form.end_time.$invalid }"
                                :disabled="time_option != 'fill'"
                                @change="validator.form.end_time.$touch()"
                            >
                            </b-form-input>
                            <div class="invalid-feedback" v-for="(item, index) in validator.form.end_time.$silentErrors" :key="index">
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <h6>Danh sách các buổi học</h6>
                        <span class="text-muted mb-2">(Danh sách các buổi học của khóa học)</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <b-form-group id="input-group-category" label="Danh mục / Giáo trình:" label-for="input-category">
                            <b-form-select id="input-category" v-model="form.category" :options="categories" placeholder="Chọn giáo trình"
                                required>
                            </b-form-select>
                        </b-form-group>
                    </div>
                </div>
                
                <div>
                    <b-table bordered
                        :fields="fields"
                        :items="form.lessions"
                    >
                        <template #cell(start_date)="data">
                            <b-row>
                                <b-col lg="6">
                                    <b-form-group id="input-group-start_time" label="Giờ bắt đầu:" label-for="input-start_time">
                                        <b-form-input id="input-start_time" type="time" min="0" v-model="form.lessions[data.index].start_time"
                                            placeholder="Chọn giờ bắt đầu" required>
                                        </b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="6">
                                    <b-form-group id="input-group-end_time" label="Giờ kết thúc:" label-for="input-end_time">
                                        <b-form-input id="input-end_time" type="time" v-model="form.lessions[data.index].end_time"
                                            placeholder="Chọn giờ bắt đầu" required
                                            aria-describedby="input-end_time-feedback"
                                            :state="endTimeState(form.lessions[data.index].start_time, form.lessions[data.index].end_time)"    
                                        >
            
                                        </b-form-input>
                                        <b-form-invalid-feedback id="input-end_time-feedback">
                                           Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu
                                        </b-form-invalid-feedback>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <!-- <flat-pickr
                                v-model="form.lessions[data.index].start_date"
                                :config="config"
                                class="form-control"
                                placeholder="Chọn thời gian bắt đầu"
                                name="start_date"
                            /> -->
                        </template>
                        <template #cell(end_date)="data">
                            <b-form-group id="input-group-lession_start_date" label="Ngày:" label-for="input-lession_start_date" class="position-relative">
                                <flat-pickr
                                    class="form-control"    
                                    name="lession_start_date"
                                    required
                                    v-model="form.lessions[data.index].start_date"
                                    :config="{
                                        wrap: true, // set wrap to true only when using 'input-group'
                                        altFormat: '',
                                        altInput: true,
                                        locale: 'vn',
                                        maxDate: this.form.end_date,
                                        minDate: this.form.start_date || new Date(),
                                    }"
                                    @blur="validator.form.lessions.$touch()"
                                />
                                <div class="label_date">{{ convertLabelDate(form.lessions[data.index].start_date)}}</div>
                            </b-form-group>
                            <div class="text-danger fs-12"
                                v-for="(item, index) in validator.form.lessions.$each.$response.$errors[data.index].start_date" :key="index"
                                :class="{
                                    'd-none': !toggle_validate
                                }"
                            >
                                {{ item.$message }}
                            </div>
                        </template>
                    </b-table>
                </div>

                <div class="d-flex justify-content-between">
                    <b-button variant="light" type="button" class="btn-label left " @click="handlePreStep">
                        <i class="bx bx-chevron-left label-icon align-middle fs-16 me-2 nexttab"></i>Trở lại
                    </b-button>
                    <!-- <b-button variant="success" type="submit" class="btn-label right ms-auto nexttab">
                        <i class="bx bx-chevron-right label-icon align-middle fs-16 ms-2 "></i>Tạo buổi học
                    </b-button> -->
                    <div class="d-flex align-items-center gap-2">
                        <b-button variant="outline-danger" class="px-4" pill @click="handleBtnBottom('cancel')">
                            Hủy
                        </b-button>
                        <b-button variant="outline-info" class="" pill @click="handleBtnBottom('saveAndExit')"> 
                            Lưu lại và thoát
                        </b-button>
                        <button-handle label="Tạo khóa học" variant="success" type="submit"
                            :isLoading="isLoadingCreate"
                        />
                    </div>
                </div>
            </b-form>

        </div>
    </fade-container>
</template>


<style lang="scss" scoped>
.label_date{
    position: absolute;
    top: 60%;
    left: 5%;
}
</style>