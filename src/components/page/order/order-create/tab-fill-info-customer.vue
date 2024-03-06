
<script>
import { coursesComputed, coursesMethods } from '../../../../state/helpers'

import {
    required,
    helpers,
    email,
} from "@vuelidate/validators";

import get from 'lodash/get';

import useVuelidate from "@vuelidate/core";
import CardFillInfoCustomer from './card-fill-info-customer.vue';
import OrderService from '../../../../services/order.service';
    
    export default {
        components: {
            CardFillInfoCustomer
        },

        data(){
            return{
                validator: useVuelidate(),
                exist_phone: true,
                exist_email: true,
                exist_email_customer: true,
                exist_phone_customer: true,
                form: JSON.parse(sessionStorage.getItem( 'order_create_subscribers' )) || {
                    name: '',
                    email: '',
                    phone: '',
                },
                
                customers: JSON.parse(sessionStorage.getItem( 'order_create_customers' )) || [{
                    name: '',
                    phone: '',
                    email: '',
                    courses: []
                }],
            }
        },

        validations: {
            form: {
                name: {
                    required: helpers.withMessage("Họ và tên là bắt buộc", required)
                },
                email: {
                    required: helpers.withMessage("Email là bắt buộc", required),
                    email: helpers.withMessage("Email không hợp lệ", email),
                },
                phone: {
                    required: helpers.withMessage("Số điện thoại là bắt buộc", required),
                    phoneState: helpers.withMessage("Số điện thoại không hợp lệ", function(){
                        return this.phoneState(this.form.phone)
                    }),
                },
            },
        },

        methods: {
            ...coursesMethods,

            _get(obj, path, defaultValue = ''){
                return get(obj, path, defaultValue)
            },
            handlePreStep(){
                this.$emit('nextStep', 2)
            },

            handleNextStep(){
                this.$emit('nextStep', 4)
            },

            phoneState(phoneNumber){
                const phoneRegex = /^[0-9]{10}$/; // Regex để kiểm tra định dạng số điện thoại (10 chữ số)
                return phoneRegex.test(phoneNumber);
            },

            addCustomer(){
                this.customers = [
                    ...this.customers,
                    {
                        name: '',
                        phone: '',
                        email: '',
                        courses: []
                    }
                ]
            },

            _setCustomer(value) {
                this.setCustomers(value)
            },

            removeCustomer(index){
                this.customers = this.customers.filter((_, i) => i !== index);
            },

            convertCouseOption(courses) {
                return courses.map(course => ({
                    value: course,
                    label: course.name
                }))
            },

            async onSubmit(event){
                event.preventDefault();
                this.validator.$validate()
                if(this.validator.$invalid) return
                this.validateEmail()
                this.validatePhone()    
                if(!this.exist_email || !this.exist_phone || !this.exist_email_customer || !this.exist_phone_customer) return
                const emails = await this.checkEmailCustomer(this.customers)
                const phones = await this.checkPhoneCustomer(this.customers)
                if(!emails || !phones) return
                this.handleNextStep()
            },

            async _checkExistEmail(email) {
                const res = await OrderService.checkEmail({
                    email: email
                })
                if(this._get(res, 'status') === 'success') return true
                return false
            },

            async _checkExistPhone(phone) {
                const res = await OrderService.checkPhone({
                    phone: phone
                })
                if(this._get(res, 'status') === 'success') return true
                return false
            },

            // handleUpdate(value) {
            //     console.log(value)
            // }
            async validateEmail() {
                this.validator.form.email.$touch()
                if(this.validator.form.email.$invalid) return
                const res = await this._checkExistEmail(this.form.email)
                this.exist_email = res
            },
            async validatePhone() {
                this.validator.form.phone.$touch()
                if(this.validator.form.phone.$invalid) return 
                const res = await this._checkExistPhone(this.form.phone)
                this.exist_phone = res
            },

            async checkEmailCustomer(customers) {
                for (let index = 0; index < customers.length; index++) {
                    const element = customers[index];
                    const email = await this._checkExistEmail(element.email)
                    if(!email) {
                        return false
                    }
                }
                return true
            },

            async checkPhoneCustomer(customers) {
                for (let index = 0; index < customers.length; index++) {
                    const element = customers[index];
                    const phone = await this._checkExistPhone(element.phone)
                    if(!phone) {
                        return false
                    }
                }
                return true
            },
        },

        computed: {
            ...coursesComputed
        },

        watch: {
            customers: {
                handler(newValue){
                    // this.setCustomers(newValue))
                    this.$emit('setCustomers', newValue)
                },
                deep: true
            },

            form: {
                handler(newValue){
                    sessionStorage.setItem('order_create_subscribers', JSON.stringify(newValue))
                },
                deep: true
            }   
        } 
    }
</script>

<template>
    <div class="">
        <b-form @submit="onSubmit"> 
            <div class="mb-3">
                <div>
                    <h6>Người đăng ký</h6>
                    <b-card class="shadow-none border">
                        <b-row>
                            <b-col lg="6">
                                <b-form-group id="input-group-name" label="Họ và tên:" label-for="input-name">
                                    <b-form-input id="input-name" v-model="form.name" placeholder="Nhập tên"
                                        :class="{
                                            'is-invalid': validator.form.name.$errors.length > 0,
                                        }"
                                        @input="validator.form.name.$touch()"
                                        @blur="validator.form.name.$touch()"
                                    >   
                                    
                                    </b-form-input>
                                    <div 
                                        class="invalid-feedback" 
                                        v-for="(item, index) in validator.form.name.$errors" 
                                        :key="index"
                                    >
                                        {{ item.$message }}
                                    </div>
                                    <!-- <b-form-group id="input-group-end_time" label="Giờ kết thúc:" label-for="input-end_time">
                                        <b-form-input id="input-end_time" type="time" min="0" v-model="form.end_time"
                                            placeholder="Chọn giờ kết thúc" required aria-describedby="input-end_time-feedback"
                                            :disabled="time_option != 'fill'" :state="endTimeState()">
                                        </b-form-input>
                                        <b-form-invalid-feedback id="input-end_time-feedback">
                                            Giờ kết thúc không được nhỏ hơn giờ khai giảng
                                        </b-form-invalid-feedback>
                                    </b-form-group> -->
                                </b-form-group>
                            </b-col>
                            <b-col lg="6">
                                <b-form-group id="input-group-phone" label="Số điện thoại:" label-for="input-phone">
                                    <b-form-input id="input-phone" v-model="form.phone" placeholder="09XXXXXXXX"   
                                        :class="{
                                            'is-invalid': validator.form.phone.$errors.length > 0 || !exist_phone,
                                        }"
                                        @input="validatePhone"
                                        @blur="validatePhone"
                                    >
                                    
                                    </b-form-input>
                                    <div 
                                        class="invalid-feedback" 
                                        v-for="(item, index) in validator.form.phone.$errors" 
                                        :key="index"
                                    >
                                
                                            {{ item.$message }}
                                    </div>
                                    <div class="invalid-feedback" v-if="!exist_phone">
                                        Số điện thoại này được đã đăng ký
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-form-group id="input-group-email" label="Email:" label-for="input-email">
                            <b-form-input type="email" id="input-email" v-model="form.email" placeholder="email@gmail.com" 
                                :class="{
                                    'is-invalid': validator.form.email.$errors.length > 0 || !exist_email,
                                }"
                                @input="validateEmail"
                                @blur="validateEmail"
                            >
                            
                            </b-form-input>
                            <div 
                                class="invalid-feedback" 
                                v-for="(item, index) in validator.form.email.$errors" 
                                :key="index"
                            >
                                    {{ item.$message }}
                            </div>
                            <div class="invalid-feedback" v-if="!exist_email">
                                Email này đã được đăng ký
                            </div>
                        </b-form-group>
                    </b-card>
                </div>
                <div>
                   <div class="d-flex align-items-center justify-content-between"> 
                        <h6>Danh sách học viên</h6>
                        <b-button size="sm"
                            @click="addCustomer"
                        >
                            <i class="ri-add-line"></i>
                            Thêm học viên
                        </b-button>
                    </div>
                    
                    <div class='mt-3' v-for="(item, index) in customers" :key="index">
                        <div class="mb-1 d-flex align-items-center justify-content-between">
                            Học viên {{ index + 1 }}
                            <b-button variant="danger" size="sm"
                                v-if="index > 0"
                                @click="removeCustomer(index)"
                            >
                                <i class="ri-delete-bin-line"></i>
                            </b-button>
                        </div>
                        <card-fill-info-customer :data="item"/>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-between gap-3">
                <b-button type="button" variant="light" class="btn-label left nexttab
        nexttab" data-nexttab="pills-info-desc-tab"
                    @click="handlePreStep"
                >
                    <i class="ri-arrow-left-line label-icon align-middle me-2 fs-16"></i>
                Trở lại
                </b-button>
                <b-button type="submit" variant="success" class="btn-label right nexttab
        nexttab" data-nexttab="pills-info-desc-tab"
                >
                    <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                Tiếp tục
                </b-button>
            </div>
        </b-form>
    </div>
</template>


<style src="@vueform/multiselect/themes/default.css"></style>