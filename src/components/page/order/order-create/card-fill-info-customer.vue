<script>
    import {
        required,
        helpers,
        email,
    } from "@vuelidate/validators";

    import { coursesComputed } from "../../../../state/helpers";

    import useVuelidate from "@vuelidate/core";

    import OrderService from '../../../../services/order.service';

    import get from "lodash/get";
    import debounce from 'lodash/debounce'

    import Multiselect from '@vueform/multiselect'

    export default {
        props: {
            data: {
                type: Object,
                default: () => ({}),
            }
        },

        components: {
            Multiselect,
        },

        data() {
            return {
                customer: this.$props.data || {name: '', email: ''},
                validator: useVuelidate(),
                exist_phone: true,
                exist_email: true,
            }
        },

        validations: {
            customer: {
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
                        return this.phoneState(this.customer.phone)
                    }),
                },
                courses: {
                    required: helpers.withMessage("Danh sách khóa học là bắt buộc", required)
                }
            },
        },

        computed: {
            ...coursesComputed
        },

        watch: {
            customer: {
                handler(newValue) {
                    this.$emit('handleUpdate', newValue)
                }
            }
        },

        methods: {
            phoneState(phoneNumber){
                const phoneRegex = /^[0-9]{10}$/; // Regex để kiểm tra định dạng số điện thoại (10 chữ số)
                return phoneRegex.test(phoneNumber);
            },
            convertCouseOption(courses) {
                return courses.map(course => ({
                    value: course,
                    label: course.name
                }))
            },

            _get(item, ref, defaultValue='') {
                return get(item, ref, defaultValue)
            },
            _debounce(func, wait) {
                return debounce(func, wait)
            },

            async _checkExistEmail() {
                const res = await OrderService.checkEmail({
                    email: this.customer.email
                })
                if(this._get(res, 'status') === 'success') return true
                return false
            },

            async _checkExistPhone() {
                const res = await OrderService.checkPhone({
                    phone: this.customer.phone
                })
                if(this._get(res, 'status') === 'success') return true
                return false
            },

            async validateEmail() {
                this.validator.customer.email.$touch()
                if(this.validator.customer.email.$invalid) return
                const res = await this._checkExistEmail()
                this.exist_email  = res
            },
            async validatePhone() {
                this.validator.customer.phone.$touch()
                if(this.validator.customer.phone.$invalid) return
                this.exist_phone = await this._checkExistPhone()
            },

        }
    }
</script>

<template>
    <b-row>
        <b-col lg="6" class="mt-2">
            
            <b-form-input type="name" id="input-name" v-model="customer.name" placeholder="Họ và tên" 
                :class="{
                    'is-invalid': validator.customer.name.$errors.length > 0,
                }"
                @input="validator.customer.name.$touch()"
                @blur="validator.customer.name.$touch()"
            >
            
            </b-form-input>
            <div 
                class="invalid-feedback" 
                v-for="(item, index) in validator.customer.name.$errors"
                :key="index"
            >
                    {{ item.$message }}
            </div>
        </b-col>
        <b-col lg="6" class="mt-2">
            
            <b-form-input type="email" id="input-email" v-model="customer.email" placeholder="email@gmail.com" 
                :class="{
                    'is-invalid': validator.customer.email.$errors.length > 0 || !exist_email,
                }"
                @input="validateEmail"
                @blur="validateEmail"
            >
            
            </b-form-input>
            <div 
                class="invalid-feedback" 
                v-for="(item, index) in validator.customer.email.$errors" 
                :key="index"
            >
                    {{ item.$message }}
            </div>
            <div class="invalid-feedback" v-if="!exist_email">
                Email này đã được đăng ký
            </div>
        </b-col>
        <b-col lg="6" class="mt-2">
            
            <b-form-input type="text" id="input-phone" v-model="customer.phone" placeholder="Số điện thoại" 
                :class="{
                    'is-invalid': validator.customer.phone.$errors.length > 0 || !exist_phone,
                }"
                @input="validatePhone"
                @blur="validatePhone"
            >
            
            </b-form-input>
            <div 
                class="invalid-feedback" 
                v-for="(item, index) in validator.customer.phone.$errors" 
                :key="index"
            >
                    {{ item.$message }}
            </div>
            <div class="invalid-feedback" v-if="!exist_phone">
                Số điện thoại này đã được đăng ký
            </div>
        </b-col>
        <b-col lg="6" class="mt-2">
            <Multiselect mode="tags" placeholder="Chọn khóa học"
                v-model="customer.courses"
                :options="convertCouseOption(course_list)"
                :class="{
                    'is-invalid': validator.customer.courses.$errors.length > 0,
                }"
                @change="validator.customer.courses.$touch()"
            >
                <template #noresults>
                    <div class="text-center text-danger italic">Không tìm thấy khóa học</div>
                </template>
                <template #tag="{option, handleTagRemove}">
                    <b-badge variant="secondary" class="d-flex align-items-center gap-1 ms-1">
                        <div class="">
                            {{ option.value.name }}
                        </div>
                        <div @click="handleTagRemove(option, $event)">
                            <span class="multiselect-tag-remove-icon"></span>
                        </div>
                    </b-badge>
                </template>
            </Multiselect>
            <div 
                class="invalid-feedback" 
                v-for="(item, index) in validator.customer.courses.$errors" 
                :key="index"
            >
                    {{ item.$message }}
            </div>
        </b-col>
    </b-row>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>