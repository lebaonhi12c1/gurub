<script>
import {
    required,
    helpers,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";


import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import moment from 'moment'


import { getToastError } from '../../../../helpers/toast'
import { convertToLowerCase } from '../../../../helpers/utils'

import CourseService from '../../../../services/course.service'

import statusLession from '../../../../config/status/status-lession'

import fadeContainer from '../../../ui/fade-container.vue'
import NoresultTable from '../../../ui/noresult-table.vue'
import Avatar from '../../../ui/avatar/avatar.vue'
import Multiselect from '@vueform/multiselect'
import Text from '../../../ui/text.vue'
import PlaceholderWraper from '../../../ui/placeholder-wraper.vue'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/l10n/vn';
import image from '../../../../config/image'
export default {
    props: {
        info_detail: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        fadeContainer,
        NoresultTable,
        Avatar,
        Multiselect,
        Text,
        PlaceholderWraper,
        flatPickr,
    },
    data() {
        return {
            edit: false,
            edit_id: '',
            isLoading: false,
            isLoadingUpdate: false,
            isLoadingStaff: false,
            statusLession,
            search: '',
            image,
            config: {
                wrap: true, // set wrap to true only when using 'input-group'
                altFormat: 'd/m/Y',
                altInput: true,
                // dateFormat: 'Y-m-d'
                locale: 'vn',
            },
            
            form: {
                start_date: new Date(),
                end_date: new Date().setDate( new Date().getDate() + 1),
                instructor_id: '',
                status: '',
                name: '',
            },
            intructors: [
                { text: 'intructor1', value: 'intructor1' },
                { text: 'intructor2', value: 'intructor2' },
            ],
            status: [
                { label: 'Đang soạn', value: 'draft' },
                { label: 'Đang hoạt động', value: 'publish' },
            ],
            fields: [
                {
                    key: 'start_date',
                    label: 'Thời gian',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end',
                },
                {
                    key: 'end_date',
                    label: 'Ngày học',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end',
                    thStyle: 'min-width: 9.375rem;'
                },
                {
                    key: 'name',
                    label: 'Tiêu đề buổi học',
                    thClass: 'bg-light'
                },
                {
                    key: 'theory',
                    label: 'Lý thuyết(%)',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end'
                },
                {
                    key: 'practice',
                    label: 'Thực hành(%)',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end'
                },
                {
                    key: 'actual_share_percent',
                    label: 'Chia sẻ(%)',
                    thClass: 'bg-light text-end',
                    tdClass: 'text-end'
                },
                {
                    key: 'intructor',
                    label: 'Giảng viên',
                    thClass: 'bg-light'
                },
                {
                    key: 'status',
                    label: 'Trạng thái',
                    thClass: 'bg-light text-center',
                    tdClass: 'text-center'
                },
                {
                    key: 'action',
                    label: 'Hành động',
                    thClass: 'bg-light text-center',
                    tdClass: 'text-center',
                },
            ],
            items: [],


            //validation
            v$: useVuelidate(),

        }
    },

    validations: {
        form: 
        {
            status: {
                required: helpers.withMessage("Trạng thái là bắt buộc", required),
            },
            name: {
                required: helpers.withMessage("Tên là bắt buộc", required),
            }
        },
    },


    computed: {
        lesstion_data: {
            get() {
                if(this.search == '') return this.items
                return this.items.filter(item => {
                    return this._checkExist(item.name, this.search) || this._checkExist(item.instructor.display_name, this.search) || this._checkExist(String(item.theory_percent), this.search) || this._checkExist(String(item.practice_percent), this.search) || this._checkExist(String(item.actual_share_percent), this.search)
                })
            }
        }
    },

    methods: {
        _moment(date) {
            return moment(date)
        },

        _convertToLowerCase(value) {
            return convertToLowerCase(value)
        },

        _get(item, ref, auto = null) {
            return _get(item, ref, auto)
        },
        _isEmpty(item) {
            return _isEmpty(item)
        },

        _checkExist(parent, value) {
            return this._convertToLowerCase(parent).includes(this._convertToLowerCase(value))
        },

       

        async getLesstions() {
            this.isLoading = true
            const res = await CourseService.getCourseDetailLessons(this.$route.params.id)
            this.items = this._get(res, 'data', [])
            this.isLoading = false
        },

        async updateLesstion(data) {
            this.isLoadingUpdate = true
            await CourseService.getCourseDetailLessonsUpdate(this.$route.params.id, this.edit_id,data)
            this.$emit('reCallAPIGetDataLession', {reCallAPIGetDataLession: true})
            this.getLesstions()
            this.isLoadingUpdate = false
        },

        async getStaffs() {
            this.isLoadingStaff = false
            const res = await CourseService.getCourseDetailStaffs(this.$route.params.id)
            this.intructors = this._get(res, 'data',[])?.map(item => {
                return {
                    label: this._get(item, 'display_name', ''),
                    value: item,
                }
            })

            this.intructors.push({ label: 'Trống', value:{
                id: 0,
                display_name: 'Trống',
                avatar_url: image.empty_box,
            } })

            this.isLoadingStaff = false
        },

        handleButtonEdit(id) {
            this.edit = true
            this.edit_id = id
            const edit_item = this.items.find(item => item.id == id)
            this.form = {
                name: this._get(edit_item, 'name', ''),
                start_date: this._moment( this._get(edit_item, 'start_date', '') * 1000).format('YYYY-MM-DD'),
                end_date:this._moment( this._get(edit_item, 'end_date', '') * 1000).format('YYYY-MM-DD'),
                instructor_id: this._get(edit_item, 'instructor', ''),
                status: this._get(edit_item, 'status', ''),
                start_time: this._moment( this._get(edit_item, 'start_date', '') * 1000).format('HH:mm'),
                end_time: this._moment( this._get(edit_item, 'end_date', '') * 1000).format('HH:mm'),
            }
        },

        handleCancelEdit() {
            this.edit = false
            this.edit_id = ''
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

        onReset() {
            this.form = {
                start_date: new Date(),
                end_date:  new Date().setDate( new Date().getDate() + 1),
                instructor_id: '',
                status: ''
            }
            this.edit = false
            this.edit_id = ''
        },

        onSubmit() {
            this.v$.$touch();

            if (this.v$.$invalid) 
            {
                return;
            } 

            if (!this.endTimeState()) return getToastError('Giờ kết thúc phải lớn hơn giờ bắt đầu')
            const convertData = {
                ...this.form,
                start_date: this._moment(this.form.end_date + ' ' + this.form.start_time).unix(),
                end_date: this._moment(this.form.end_date + ' ' + this.form.end_time).unix(),
                instructor_id: _get(this.form, 'instructor_id.id', 0), 
            }
            this.updateLesstion(convertData)
            this.onReset()
        }
    },

    mounted() {
        this.getLesstions()
        this.getStaffs()
    }
}
</script>

<template>
    <fade-container>
        <b-card no-body>
            <b-card-header>
                <div class="d-flex align-items-center justify-content-between">
                    <h5>Buổi học</h5>
                    <div class="d-flex align-items-center gap-3">
                        <b-form-input style="width: 15rem;" type="search" placeholder="Nhập từ khóa bạn cần tìm"
                            v-model="search"
                        >
    
                        </b-form-input>
                        <i class="mdi mdi-magnify fs-4"></i>
                    </div>
                </div>
            </b-card-header>

            <b-card-body>
                <b-table v-if="isLoading" sticky-header hover striped bordered responsive data-simplebar
                    style="height: calc(100vh - 500px)" :fields="fields"
                    :items="Array(25).fill().map((item) => ({ code: item }))">
                    <template v-for="(field, index) in fields" :key="`${_get(field, 'key')}${index}`"
                        v-slot:[`cell(${field.key})`]>
                        <div class="placeholder placeholder-glow rounded w-100">
                            &nbsp;
                        </div>
                    </template>
                </b-table>
                <b-form v-else @submit="onSubmit">
                    <b-table bordered show-empty responsive data-simplebar
                        :hover="!_isEmpty(items)" 
                        :items="lesstion_data" 
                        :fields="fields"
                    >
                        <template #empty>
                            <noresult-table />
                        </template>
                        <template #head()="scope">
                            <div class="text-nowrap">
                                {{ scope.label }}
                            </div>
                        </template>

                        <template #cell(start_date)="data">
                            <div class="text-nowrap" v-if="edit_id != _get(data,'item.id')">
                                {{ _moment(_get(data, 'item.start_date') * 1000, '').format('HH:mm') }} - 
                                {{ _moment(_get(data, 'item.end_date') * 1000, '').format('HH:mm') }}
                            </div>
                            <div class="d-flex align-items-center gap-2" v-if="edit && edit_id == _get(data, 'item.id')">
                                <!-- <flat-pickr
                                    v-model="form.start_date"
                                    :config="config"
                                    class="form-control"
                                    placeholder="Chọn thời gian bắt đầu"
                                    name="start_date"
                                    
                                /> -->

                                <b-form-input  type="time" id="input-start_time" v-model="form.start_time" placeholder="Chọn giờ"/>
                                <div>
                                    <b-form-input type="time" id="input-end_time" v-model="form.end_time" placeholder="Chọn giờ"
                                        aria-describedby="input-end_time-feedback"
                                        :state="endTimeState()" 
                                    />
                                    <b-form-invalid-feedback id="input-end_time-feedback">
                                        Thời gian kết thúc phải lớn hơn thời gian bắt đầu
                                    </b-form-invalid-feedback>
                                </div>
                            </div>
                        </template>

                        <template #cell(end_date)="data">
                            <div class="text-nowrap" v-if="edit_id != _get(data, 'item.id')">
                                {{ _moment(_get(data, 'item.end_date') * 1000, '').format('DD/MM/YYYY') }}
                            </div>
                            <div v-if="edit && edit_id == _get(data, 'item.id')">
                                <flat-pickr
                                    v-model="form.end_date"
                                    :config="{
                                        ...config,
                                        minDate: new Date(this._get(info_detail, 'start_date')*1000),
                                        maxDate: new Date(this._get(info_detail, 'end_date')*1000),
                                    }"
                                    class="form-control"
                                    placeholder="Chọn Thời gian kết thúc"
                                    name="end_date"
                                />
                            </div>
                        </template>

                        <template #cell(date)="data">
                            <div class="text-nowrap" v-if="edit_id != _get(data, 'item.id')">
                                {{ _moment(_get(data, 'item.date')).format('DD/MM/YYYY') }}
                            </div>
                            <div class="d-flex align-items-center gap-2" v-if="edit && edit_id == _get(data, 'item.id')">
                                <b-form-input 
                                    type="date" id="input-start_date" 
                                    v-model="form.date" placeholder="Nhập date"
                                >
                                </b-form-input>
                            </div>
                        </template>

                        <template #cell(name)="data">
                            <div class="text-nowrap" v-if="edit_id != _get(data, 'item.id')">
                                <Text :text="_get(data, 'item.name')"/>
                            </div>
                            <div  v-if="edit && edit_id == _get(data, 'item.id')">
                                <b-form-input style="width: 15rem;" type="text" placeholder="Nhập tên buổi học"
                                    v-model="form.name"
                                    @input="v$.form.name.$touch"
                                    @blur="v$.form.name.$touch"
                                    :class="{ 'is-invalid': v$.form.name.$errors.length > 0 }"
                                >
                                </b-form-input>
                                <div class="invalid-feedback"
                                    v-for="(item, index) in v$.form.name.$errors" :key="index"
                                >   
                                    {{ item.$message }}
                                </div>
                            </div>
                        </template>

                        <template #cell(theory)="data">
                            <div class="text-nowrap">
                                <Text :text=" _get(data,'item.theory_percent')" css="d-flex justify-content-end"/>
                            </div>
                        </template>

                        <template #cell(practice)="data">
                            <div class="text-nowrap">
                                <Text :text="  _get(data,'item.practice_percent')" css="d-flex justify-content-end"/>
                            </div>
                        </template>

                        <template #cell(intructor)="data">
                            <div class="" v-if="edit_id != _get(data, 'item.id')">
                                <div v-if="_isEmpty(_get(data, 'item.instructor'))">
                                    --
                                </div>
                                <div v-else class="text-nowrap d-flex align-items-center gap-2">
                                    <avatar :src="_get(data, 'item.instructor.avatar_url')" :name="_get(data, 'item.instructor.display_name')"
                                        size="xxs" />
                                    {{ _get(data, 'item.instructor.display_name') }}
                                </div>
                            </div>
                            <multiselect mode="single" id="input-intructor" placeholder="Chọn giảng viên" style="min-width: 12.5rem;" searchable
                                v-if="edit && edit_id == _get(data, 'item.id')"
                                v-model="form.instructor_id" 
                                :options="intructors"
                            >
                                <template #noresults>
                                    <div class="text-danger text-center italic">Không tìm thấy</div>
                                </template>
                                <template #option="{ option }">
                                    <div class="d-flex align-items-center gap-2">
                                        
                                        <placeholder-wraper :isLoading="isLoadingStaff">
                                            <avatar size="xxs" :name="_get(option, 'label','')" :src="_get(option, 'value.avatar_url','')" />
                                        </placeholder-wraper>
                                        <placeholder-wraper :isLoading="isLoadingStaff">
                                            <Text :text="option.label" />
                                        </placeholder-wraper>
                                    </div>
                                </template>
                            </multiselect>
                        </template>

                        <template #cell(status)="data">
                            <div class="badge rounded-pill" v-if="edit_id != _get(data, 'item.id')"
                                :class="_get(statusLession, _get(data, 'item.status') +'.class', 'danger')">
                            
                                <span class="text-uppercase">
                                    {{ _get(statusLession, _get(data, 'item.status') +'.label', 'Đang cập nhật') }}
                                </span>
                            </div>
                            <multiselect v-model="form.status" placeholder="Chọn trạng thái" style="min-width: 12.5rem ;"
                                v-if="edit && edit_id == _get(data, 'item.id')"
                                :options="status"
                                :class="{ 'is-invalid': v$.form.status.$errors.length>0 }"
                                @input="v$.form.status.$touch" 
                                @blur="v$.form.status.$touch" 
                            />
                            <div 
                                class="invalid-feedback" 
                                v-for="(item, index) in v$.form.status.$errors" 
                                :key="index"
                            >
                        
                                {{ item.$message }}
                            </div>
                        </template>


                        <template #cell(action)="data">
                            <div class="d-flex align-items-center gap-2 justify-content-center"
                                v-if="edit_id != _get(data, 'item.id')">
                                <b-button variant="success" size="sm" v-b-tooltip.hover="{ title: 'Sửa' }"
                                    @click="handleButtonEdit(_get(data, 'item.id'))" :disabled="edit_id != _get(data, 'item.id') && edit">
                                    <i class='bx bx-edit-alt'></i>
                                </b-button>
                            </div>

                            <div class="d-flex align-items-center gap-2 justify-content-center"
                                v-if="edit && edit_id == _get(data, 'item.id')">
                                <b-button variant="danger" size="sm" v-b-tooltip.hover="{ title: 'Hủy' }"
                                    @click="handleCancelEdit()">
                                    <i class='bx bx-message-alt-x'></i>
                                </b-button>
                                <b-button type="submit" variant="info" size="sm" v-b-tooltip.hover="{ title: 'Lưu' }">
                                    <i class='bx bx-save'></i>
                                </b-button>
                            </div>
                        </template>
                    </b-table>
                </b-form>
            </b-card-body>
        </b-card>
    </fade-container>
</template>


<style src="@vueform/multiselect/themes/default.css"></style>