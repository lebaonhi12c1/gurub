
<script>
import {
    required,
    helpers,
    numeric,
    maxLength,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import CourseService from '../../../../../services/course.service'

import fadeContainer from '../../../../ui/fade-container.vue'
import Multiselect from '@vueform/multiselect'

import _get from 'lodash/get'
import _head from 'lodash/head'
import isEmpty from "lodash/isEmpty";


import Avatar from '../../../../ui/avatar/avatar.vue';
import PlaceholderWraper from '../../../../ui/placeholder-wraper.vue';
import Text from '../../../../ui/text.vue';
import Swal from "sweetalert2";
export default {
    components: {
    Multiselect,
    fadeContainer,
    Avatar,
    PlaceholderWraper,
    Text,
},
    
    data(){
        return{
            v$: useVuelidate(),
            cateagories: [],
            isLoadingStaffs: false,
            form: JSON.parse(sessionStorage.getItem( 'form_create_coures_info' )) || {
                name: '',
                method: 'offline',
                capacity: 0,
                instructor_id: 0,
                type: 'google-ads',
                level: 'basic',
                image: null,
                teaching_assistant: [],
                description: '',
                zone: 'hcm',
                stage: 'open',
                status:'draft',
                code: '',
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
                { text:'Bản nháp', value: 'draft' },
                { text: 'Đang hoạt động', value: 'publish' },
            ],

            stages: [
                 { text:'Đang mở đăng ký', value: 'open'},
                 { text:'Đã đóng đăng ký', value: 'closed'},
                 { text:'Đang diễn ra', value: 'inprogress'},
                 { text:'Đã hoàn thành', value: 'completed'},
                 { text:'Đã hủy', value: 'cancelled'},   
            ],

            staffs: [],

            staff_option: [],
            teaching_assistant_option: []
            
        }
    },

    validations: {
        form:
        {
            code: {
                required: helpers.withMessage(" Mã khoá học không được bỏ trống", required),
                maxLength: helpers.withMessage("Mã khóa học tối da 30 ký tự", maxLength(30)),
            },
            name: {
                required: helpers.withMessage(" Tên khoá học không được bỏ trống", required),
                maxLength: helpers.withMessage("Tên khóa học tối da 60 ký tự", maxLength(60)),
            },
            capacity: {
                required: helpers.withMessage(" Sức chứa không được bỏ trống", required),
                numeric: helpers.withMessage(" Vui lòng nhập giá trị bằng số", numeric),
                positive: helpers.withMessage(" Giá trị nhập vào phải lớn hơn 0", function(value){
                    return value > 0
                }),
            }
        }
    },
    methods: {
        _get(item, ref, auto = null){
            return _get(item, ref, auto)
        },

        _isEmpty(item) {
            return isEmpty(item)
        },

        _head(item){
            return _head(item)
        },

        convertToOption(list = []) {
            return list.map(item => (
                    { label: item, value: item.id}
            ))
        },

        async getIntructors() {
            this.isLoadingStaffs=true
            const res = await CourseService.getStaffs();
            this.staffs = this._get(res, 'data')
            this.staff_option = this.convertIntuctorsOption(this.form.zone, this.staffs).map(item => (
                    { label: item, value: item.id}
            ))

            this.staff_option = this.staff_option.filter(item => !this.form.teaching_assistant.includes(item.value))
            
            this.teaching_assistant_option = this.convertIntuctorsOption(this.form.zone, this.staffs).map(item => (
                    { label: item, value: item.id}
            ))
            this.teaching_assistant_option = this.teaching_assistant_option.filter(item => item.value != this.form.instructor_id)
            this.isLoadingStaffs=false
        },

        convertIntuctorsOption(zone, list) {
            return list.filter(item => item.zone === zone)
        },
        onSubmit(event) {
            this.v$.$touch();
            if (this.v$.$invalid) 
            {
                return;
            } 
            event.preventDefault();

            this.$emit('nextStep',1)
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

    },


    mounted(){
        this.getIntructors()
    },

    // computed: {
    //     staff_option: {
    //         get(){
    //             return this.convertIntuctorsOption(this.form.zone, this.staffs).map(item => (
    //                 { label: item.display_name, value: item}
    //             ))
    //         }
    //     }
    // },

    watch: {
        form: {
            handler(newValue) {
                sessionStorage.setItem('form_create_coures_info', JSON.stringify(newValue));
            },
            deep: true
        },

        'form.zone': {
            handler(newValue) {
                this.staff_option = this.convertIntuctorsOption(newValue, this.staffs).map(item => (
                    { label: item, value: item.id}
                ))
                this.teaching_assistant_option = this.convertIntuctorsOption(newValue, this.staffs).map(item => (
                    { label: item, value: item.id}
                ))
                this.form.instructor_id = this._head(this.staff_option)?.value || ''
                this.form.teaching_assistant = []
            },
            deep: true
        },

        'form.teaching_assistant': {
            handler(newValue) {
                this.staff_option = this.convertToOption(this.convertIntuctorsOption(this.form.zone, this.staffs)).filter(item => !newValue.includes(item.value))
            }
        },

        'form.instructor_id': {
            handler(newValue) {
                this.teaching_assistant_option = this.convertToOption(this.convertIntuctorsOption(this.form.zone, this.staffs)).filter(item => item.value != newValue)}
        }
    },
    

}
</script>

<template>
    <fade-container>
        <div class="tab-pane fade show active" id="pills-bill-info" role="tabpanel" aria-labelledby="pills-bill-info-tab">
            <div>
                <h5 class="mb-1">Các thông tin cơ bản</h5>
                <p class="text-muted mb-4">
                    Nhập các thông tin cơ bản để hoàn thành bước này
                </p>
            </div>
            <b-form @submit="onSubmit">
                <b-row>
                    <b-col lg="6">
                        <b-form-group id="input-group-code" label="Mã khóa học:" label-for="input-code">
                            <b-form-input 
                                id="input-code" 
                                v-model="form.code" 
                                placeholder="Nhập mã" 
                                :class="{ 'is-invalid': v$.form.code.$errors.length>0 }"
                                @input="v$.form.code.$touch" 
                                @blur="v$.form.code.$touch"  
                            
                            ></b-form-input>
                            <div 
                                class="invalid-feedback" 
                                v-for="(item, index) in v$.form.code.$errors" 
                                :key="index"
                            >
                        
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                        <b-form-group id="input-group-name" label="Tên khóa học:" label-for="input-name">
                            <b-form-input 
                                id="input-name" 
                                v-model="form.name" 
                                placeholder="Nhập tên" 
                                :class="{ 'is-invalid': v$.form.name.$errors.length>0 }"
                                @input="v$.form.name.$touch" 
                                @blur="v$.form.name.$touch"  
                        
                            >
                            </b-form-input>
                            <div 
                                class="invalid-feedback" 
                                v-for="(item, index) in v$.form.name.$errors" 
                                :key="index"
                            >
                        
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                        <b-row>
                            <b-col lang="6">
                                <b-form-group id="input-group-method" label="Hình thức:" label-for="input-method">
                                    <b-form-select
                                      id="input-method"
                                      v-model="form.method"
                                      :options="methods"
                                      required  
                                    ></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col lang="6">
                                <b-form-group id="input-group-capacity" label="Sức chứa:" label-for="input-capacity">
                                    <b-form-input id="input-capacity" type="number" placeholder="Nhập số lượng" min="0"
                                        v-model="form.capacity"
                                        :class="{ 'is-invalid': v$.form.capacity.$errors.length>0 }"
                                        @input="v$.form.capacity.$touch" 
                                        @blur="v$.form.capacity.$touch"  
                                    >
                                    </b-form-input>
                                    <div 
                                        class="invalid-feedback" 
                                        v-for="(item, index) in v$.form.capacity.$errors" 
                                        :key="index"
                                    >
                                
                                        {{ item.$message }}
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col lang="6">
                                <b-form-group id="input-group-type" label="Loại:" label-for="input-type">
                                    <b-form-select
                                      id="input-type"
                                      v-model="form.type"
                                      :options="types"
                                      required
                                    ></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col lang="6">
                                <b-form-group id="input-group-level" label="Cấp độ:" label-for="input-level">
                                    <b-form-select
                                      id="input-level"
                                      v-model="form.level"
                                      :options="levels"
                                      required
                                    ></b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col lang="6">
                                <b-form-group id="input-group-stage" label="Tình trạng:" label-for="input-stage">
                                    <b-form-select
                                      id="input-stage"
                                      v-model="form.stage"
                                      :options="stages"
                                      required
                                    ></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col lang="6">
                                <b-form-group id="input-group-status" label="Trạng thái:" label-for="input-status">
                                    <b-form-select
                                      id="input-status"
                                      v-model="form.status"
                                      :options="statuss"
                                      required
                                    ></b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col lg="6">
                        <b-form-group id="input-group-zone" label="Địa điểm:" label-for="input-zone">
                            <b-form-select
                                id="input-zone"
                                v-model="form.zone"
                                :options="zones"
                                required
                            ></b-form-select>
                        </b-form-group>
                        <b-form-group id="input-group-intructor" label="Giảng viên:" label-for="input-intructor">
                            <multiselect mode="single" id="input-intructor" placeholder="Chọn giảng viên" searchable
                                style="border: 1px solod red !important;"
                                v-model="form.instructor_id"
                                :options="staff_option"
                            >
                                <template #nooptions>
                                    <div class="text-danger p-2">
                                        Không tìm thấy kết quả
                                    </div>
                                </template>
                                <template #noresults>
                                    <div class="text-danger p-2">
                                        Không tìm thấy kết quả
                                    </div>
                                </template>
                                <template #singlelabel="{ value }">
                                   <div class="text-start w-100 ms-3" style="z-index: 200"> {{ _get(value, 'label.display_name') }}</div>
                                </template>
                                <template #option="{ option }">
                                    
                                    <div class="d-flex align-items-center gap-2">
                                        <placeholder-wraper :isLoading="isLoadingStaffs">
                                            <avatar size="xxs" :name="_get(option.label, 'display_name')" :src="_get(option.label, 'avatar_url')"/>
                                        </placeholder-wraper>
                                        <placeholder-wraper>
                                            <Text :text="_get(option.label, 'display_name')"/>
                                        </placeholder-wraper>
                                    </div>
                                </template>
                            </multiselect>
                        </b-form-group>
                        <b-form-group id="input-group-intructors" label="Giảng viên liên quan:" label-for="input-intructors">
                            <multiselect mode="tags" placeholder="Chọn giảng viên" searchable
                                v-model="form.teaching_assistant"
                                :options="teaching_assistant_option"
                            >   
                                <template #nooptions>
                                    <div class="text-danger p-2">
                                        Không tìm thấy kết quả
                                    </div>
                                </template>
                                <template #noresults>
                                    <div class="text-danger p-2">
                                        Không tìm thấy kết quả
                                    </div>
                                </template>
                                <template #tag="{option, handleTagRemove}">
                                    <b-badge variant="secondary" class="d-flex align-items-center gap-1 ms-1">
                                        <div class="">
                                            {{ _get(option, 'label.display_name')}}
                                        </div>
                                        <div @click="handleTagRemove(option, $event)">
                                            <span class="multiselect-tag-remove-icon"></span>
                                        </div>
                                    </b-badge>
                                </template>
                                <template #option="{ option }">
                                    <div class="d-flex align-items-center gap-2">
                                        <placeholder-wraper :isLoading="isLoadingStaffs">
                                            <avatar size="xxs" :name="_get(option.label, 'display_name')" :src="_get(option.label, 'avatar_url')"/>
                                        </placeholder-wraper>
                                        <placeholder-wraper>
                                            <Text :text="_get(option.label, 'display_name')"/>
                                        </placeholder-wraper>
                                    </div>
                                </template>
                            </multiselect>
                        </b-form-group>
                        <b-form-group id="input-group-description" label="Mô tả:" label-for="input-description">
                            <b-form-textarea
                                id="textarea"
                                v-model="form.description"
                                placeholder="Mô tả..."
                                rows="3"
                                max-rows="6"
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                
                <div class="d-flex justify-content-end">
                    <div class="d-flex align-items-center gap-3">
                        <b-button variant="outline-danger" class="px-4" pill @click="handleBtnBottom('cancel')">
                            Hủy
                        </b-button>
                        <b-button variant="outline-info" class="" pill @click="handleBtnBottom('saveAndExit')"> 
                            Lưu lại và thoát
                        </b-button>
                        <b-button variant="success" type="submit" class="btn-label right ms-auto nexttab">
                            <i class="bx bx-chevron-right label-icon align-middle fs-16 ms-2 "></i>Tiếp tục
                        </b-button>
                    </div>
                </div>
            </b-form>
        </div>
    </fade-container>
</template>


<style src="@vueform/multiselect/themes/default.css">

</style>

