
<script>
import {
    required,
    helpers,
    numeric 
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import fadeContainer from '../../../../ui/fade-container.vue'

import _get from 'lodash/get'
import Swal from "sweetalert2";

import { convertNumber, convertStringToNumber, convertCurrencyToNumber } from "../../../../../helpers/utils";
export default {
    components: { fadeContainer },
    
    data(){
        return{
            v$: useVuelidate(),

            form: JSON.parse(sessionStorage.getItem( 'form_create_coures_price' )) || {
                currency: 'vnd',
                unit: 'person',
                original_price: 0,
                discounted_price: 0,
            },

            price_lower: '0',
            currencys: [
                { text: 'VND', value:'VND' },
            ],
            units: [
                { text: '1 Người', value:'1 Người' },
            ],
            price_options: [
                { text: 'Không giảm giá', value:'0' },
                { text: 'Nhập giá thủ công', value:'fill' },
                { text: 'Giảm 10%', value:'10' },
                { text: 'Giảm 30%', value:'30' },
            ]
        }
    },
    validations: {
        form:
        {
            original_price: {
                required: helpers.withMessage("Giá gốc không được bỏ trống", function(value){
                    return this._checkPriceZero(value)
                }),
                numeric_validate: helpers.withMessage("Bạn phải nhập số", function(){
                    return this._checkIsNumber(this.form.original_price)
                } ),
            },
            discounted_price: {
                required: helpers.withMessage("Giá gốc không được bỏ trống", function(value){
                    return this._checkPriceZero(value)
                }),
                check_discounted_price: helpers.withMessage("Giá đã giảm không được lớn hơn giá gốc", function(){ 
                    return this.checkDiscountedPrice()
                }),
                numeric_validate: helpers.withMessage("Bạn phải nhập số", function(){
                    return this._checkIsNumber(this.form.discounted_price)
                } ),
            }
        }
    },

    methods: {
        _get(item, ref, auto = null){
            return _get(item, ref, auto)
        },

        handlePreStep() {
            this.$emit('nextStep',0)
        },

        _convertNumber(value) {
            return convertNumber(value)
        },

        onSubmit(event) {
            this.v$.$touch();
            if (this.v$.$invalid) 
            {
                return;
            } 
            event.preventDefault();
            this.$emit('nextStep',2)
        },

        // formatter(value) {
        //    return Number(value).toLocaleString().toString()
        // }

        check_discounted_price() 
        {
            return this.form.discounted_price >= this.form.original_price
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
                if (result.value) {
                    
                    // Swal.fire("Đã xóa!", `Bạn đã xóa khóa học khỏi hệ thống.`, "success");
                }
            });
                return
            }

            if (value == 'saveAndExit') {
                this.$router.push({ path: '/courses' })
            }
        },

        format(value) {
            if(this._convertNumber(this._convertCurrencyToNumber(value))== 'NaN') return value
            return this._convertNumber(this._convertStringToNumber(value))
        },

        _convertStringToNumber(string) {
            return convertStringToNumber(string)
        },

        _convertCurrencyToNumber(currency) {
            return convertCurrencyToNumber(currency)
        },

        _checkPriceZero(value) {
            if(value == 0 ) return false
            return true
        },

        _checkIsNumber(value){
            if(isNaN(this._convertCurrencyToNumber(value))) return false
            return true
        },

        checkDiscountedPrice() {
            return Number(this._convertCurrencyToNumber( this.form.discounted_price)) <=Number(this._convertCurrencyToNumber( this.form.original_price))
        },
    },

    mounted(){
    },

    computed: {
    },

    watch: {
        form: {
            handler(newValue) {
                sessionStorage.setItem('form_create_coures_price', JSON.stringify(newValue));
            },
            deep: true
        },

        'form.original_price': {
            handler(newValue) { 
                if(this.price_lower == 0){
                    this.form.discounted_price = (this.form.original_price)
                    return
                }
                if(this.price_lower == 'fill'){
                    this.form.discounted_price = (this.form.original_price)
                    return
                }

                if(this._convertNumber(this._convertCurrencyToNumber(newValue))== 'NaN') return newValue
                this.form.discounted_price = this._convertCurrencyToNumber(newValue) - (this._convertCurrencyToNumber(newValue) * Number(this.price_lower) / 100)
                this.form.discounted_price = this._convertNumber(this.form.discounted_price)
            }
        },

        price_lower: {
            handler(newValue) {
                if(this.price_lower == 0){
                    this.form.discounted_price = this.form.original_price
                    return
                }
                if(newValue == 'fill') return
                this.form.discounted_price = this._convertCurrencyToNumber(this.form.original_price) - (this._convertCurrencyToNumber(this.form.original_price) * Number(newValue) / 100)

                this.form.discounted_price = this._convertNumber(this.form.discounted_price)
            }
        }
    },
    

}
</script>

<template>
    <fade-container>
        <div class="tab-pane fade show active" id="pills-bill-info" role="tabpanel" aria-labelledby="pills-bill-info-tab">
            <div>
                <h5 class="mb-1">Giá khóa học</h5>
                <p class="text-muted mb-4">
                    Đặt giá cho khóa học bằng cách điền thông tin bên dưới
                </p>
            </div>
            <b-form @submit="onSubmit">
                <b-row>
                    <b-col lg="6">
                        <b-form-group id="input-group-currency" label="Đơn vị tiền tệ:" label-for="input-currency">
                            <b-form-input
                                id="input-currency"
                                v-model="currencys[0].value"
                                disabled
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col lg="6">
                        <b-form-group id="input-group-unit" label="Đơn vị tính so với giá:" label-for="input-unit">
                            <b-form-input
                                id="input-unit"
                                v-model="units[0].value"
                                required
                                disabled
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="4">
                        <b-form-group id="input-group-price_option" label="Tùy chỉnh giá:" label-for="input-price_option">
                            <b-form-select
                                id="input-price_option"
                                v-model="price_lower"
                                :options="price_options"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-original_price" label="Giá gốc:" label-for="input-original_price">
                            <b-form-input 
                            id="input-original_price"  
                                v-model="form.original_price"  placeholder="VND"
                                :class="{ 'is-invalid': v$.form.original_price.$errors.length>0 }"
                                :formatter="format"
                                @input="v$.form.original_price.$touch" 
                                @blur="v$.form.original_price.$touch"  
                            >
                            </b-form-input>
                            <div 
                                class="invalid-feedback" 
                                v-for="(item, index) in v$.form.original_price.$errors" 
                                :key="index"
                            >
                        
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4">
                        <b-form-group id="input-group-discounted_price" label="Giá giảm:" label-for="input-discounted_price">
                            <b-form-input id="input-discounted_price"        
                                v-model="form.discounted_price" placeholder="VND" required
                                :disabled="price_lower != 'fill'"
                                :class="{ 'is-invalid': v$.form.discounted_price.$errors.length>0 }"
                                :formatter="format"
                                @input="v$.form.discounted_price.$touch" 
                                @blur="v$.form.discounted_price.$touch"  
                            >
                            
                            </b-form-input>
                            <div 
                                class="invalid-feedback" 
                                v-for="(item, index) in v$.form.discounted_price.$errors" 
                                :key="index"
                            >
                        
                                {{ item.$message }}
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
                <div class="d-flex justify-content-between">
                    <b-button variant="light" type="button" class="btn-label left "
                        @click="handlePreStep"
                    >
                        <i class="bx bx-chevron-left label-icon align-middle fs-16 me-2 nexttab"></i>Trở lại
                    </b-button>
                   <div class="d-flex align-items-center gap-2">
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


<style lang="scss" scoped></style>