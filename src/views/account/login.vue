<script>
import {
    required,
    helpers,
    minLength 
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import authService from "../../services/auth.service";
import get from "lodash/get";
import { getToastError } from '../../helpers/toast';
import Swal from "sweetalert2";


export default {
   
    data() {
        return {
            get,
            email: "",
            password: "",
            Swal,
            isLoadingLoginUsernamePassword: false,
            isLoginFirebase: false,
            remmemberMe: true,
            v$: useVuelidate(),
            showPassword: false,
        };
    },
    validations: {
        email: {
            required: helpers.withMessage("Tài khoản là bắt buộc", required),
            minLength: helpers.withMessage("Tài khoản phải có ít nhất 3 ký tự", minLength(3)),
        },
        password: {
            required: helpers.withMessage("Mật khẩu là bắt buộc", required),
            minLength: helpers.withMessage("Mật khẩu phải có ít nhất 8 ký tự", minLength(8)),
        },
    },
    computed: {

    },
    methods: {

        _get(core, item, defaultVal = null) {
            return get(core, item, defaultVal);
        },
        // Try to log the user in with the username
        // and password they provided.
        async tryToLogIn() {
            // // stop here if form is invalid
            //     // stop here if form is invalid
        

            //     localStorage.setItem('GURUB-TOKEN', 123)
            //     this.$router.push('/')
                
            //     return      
                
        this.v$.$touch();

        if (this.v$.$invalid) 
        {
            return;
        } 
        this.isLoadingLoginUsernamePassword = true;
        
       

        let response =  await authService.loginWithUsernamePassword({
            user_name: this.email, 
            password: this.password,  
            remember_me: this.remmemberMe
        })



        
        this.isLoadingLoginUsernamePassword = false;

        if(this._get(response,'status') != 'success') return
        
        localStorage.setItem('GURUB-TOKEN', JSON.stringify(get(response, 'data')))

        Swal.fire({
            title: "Đăng nhập thành công",
            text: "Chúc mừng bạn đã đăng nhập thành công vào hệ thống!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        })
        setTimeout(() => {
            this.$router.push('/')
            
        }, 1500);
        
        },

        async signInWithFirebase() {
            this.isLoginFirebase = true;
            const res = await authService.loginWithFirebase()
            this.isLoginFirebase = false;
            if(this._get(res,'status') != 'success') return
            localStorage.setItem('GURUB-TOKEN', JSON.stringify(this._get(res, 'data')))
            if(!res.data) return getToastError('Đã xảy ra lỗi trong quá trình đăng nhập')
            this.$router.push('/')
        },

    },
};
</script>

<template>
    <b-container>
        <b-row>
            <b-col lg="12">
                <div class="text-center mt-sm-5 mb-4 text-white-50">
                    <div>
                        <h1 class="text-bold text-light"><span class="text-secondary" style="text-shadow: 2px 2px #fff;">G</span><span class="text-danger"  style="text-shadow: 2px 2px #fff;">U</span><span class="text-warning"  style="text-shadow: 2px 2px #fff;">R</span><span class="text-success"  style="text-shadow: 2px 2px #fff;">U</span> BOOKING</h1>
                    </div>
                    <p class="mt-3 fs-15 fw-medium">
                        Trang quản trị chuyên nghiệp
                    </p>
                </div>
            </b-col>
        </b-row>

        <b-row class="justify-content-center"  style="height: 300px;">
            <b-col md="8" lg="6" xl="5">
                <b-card no-body class="mt-4">
                    <b-card-body class="p-4">
                        <div class="text-center mt-2">
                            <h5 class="text-primary">Chào mừng bạn!</h5>
                            <p class="text-muted">Đăng nhập để tiếp tục với GURUB.</p>
                        </div>
                        <div class="p-2 mt-4">
                            <b-form  >
                                <div class="mb-3">
                                    <label class="form-label" for="email-input">Tài khoản</label>
                                    <input  v-model="email" class="form-control pe-5"
                                        placeholder="Nhập tài khoản" id="email-input"
                                        :class="{ 'is-invalid': v$.email.$errors.length>0 }"
                                        style="background-image: none !important;"
                                        @input="v$.email.$touch" 
                                        @blur="v$.email.$touch" 
                                        tabindex="1"
                                    />
                                        <div 
                                        class="invalid-feedback" 
                                        v-for="(item, index) in v$.email.$errors" 
                                        :key="index"
                                    >
                                
                                        {{ item.$message }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <div class="float-end">     
                                        <router-link to="/forgot-password" class="text-muted">Quên mật khẩu</router-link>
                                    </div>
                                    <label class="form-label" for="password-input">Mật khẩu</label>
                                    <div class="position-relative auth-pass-inputgroup mb-3">
                                        <input 
                                            :type="!showPassword?'password':'text'" 
                                            v-model="password" class="form-control pe-5"
                                            placeholder="Nhập mật khẩu" id="password-input"
                                            :class="{ 'is-invalid': v$.password.$errors.length>0 }"
                                            style="background-image: none !important;"
                                            @input="v$.password.$touch" 
                                            @blur="v$.password.$touch" 
                                            tabindex="2"

                                        />
                                            <div 
                                            class="invalid-feedback" 
                                            v-for="(item, index) in v$.password.$errors" 
                                            :key="index"
                                        >
                                    
                                            {{ item.$message }}
                                        </div>
                                        <b-button variant="link"
                                            @click="showPassword = !showPassword"
                                            class="position-absolute end-0 top-0 text-decoration-none text-muted"
                                            type="button" id="password-addon">
                                            <i class="ri-eye-fill align-middle"></i>
                                        </b-button>
                                     
                                    </div>
                                </div>

                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="remmemberMe"  id="auth-remember-check" />
                                    <label class="form-check-label" for="auth-remember-check">Ghi nhớ mật khẩu</label>
                                </div>

                                <div class="mt-4">

                                    <div 
                                        v-if="isLoadingLoginUsernamePassword"
                                    >
                                        <button type="button" class="btn w-100 btn-success btn-load">
                                            <span class="d-flex align-items-center justify-content-center">
                                                <span class="spinner-border flex-shrink-0" role="status">
                                                    <span class="visually-hidden">
                                                        Loading...
                                                    </span>
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                    <div v-else>
                                        <b-button variant="success" class="w-100 text-h6" type="submit"  tabindex="3"
                                            @click="tryToLogIn"

                                        >
                                            Đăng nhập
                                        </b-button>
                                    </div>
                                </div>

                                <div class="mt-4 text-center">
                                    <div class="signin-other-title">
                                        <h5 class="fs-13 mb-4 title">
                                            Đăng nhập với
                                        </h5>
                                    </div>
                                    <div v-if="isLoginFirebase">
                                        <div class="google-btn" 
                                        >
                                            <span class="d-flex align-items-center justify-content-center w-100">
                                                <span class="spinner-border text-white flex-shrink-0" role="status">
                                                    <span class="visually-hidden">
                                                        Loading...
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="google-btn" tabindex="4"
                                            @click="signInWithFirebase"
                                        >
                                            <div class="google-icon-wrapper">
                                                <img class="google-icon" src="../../assets/images/course-logo/google-logo.png" />
                                            </div>
                                            <p class="btn-text text-h6">Đăng nhập với Google</p>
                                        </div>
                                    </div>
                                </div>
                            </b-form>
                        </div>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="scss">
$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669F2;

.google-btn {
    width: 100%;
    height: 42px;
    background-color: $google-blue;
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding: 4px;

    .google-icon-wrapper {
        width: 38px;
        height: 100%;
        border-radius: 2px;
        background-color: $white;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .google-icon {
        width: 18px;
        height: 18px;
    }

    .btn-text {
        color: $white;
        letter-spacing: 0.2px;
        font-weight: bold;
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin: 0;

    }

    &:hover {
        box-shadow: 0 0 6px $google-blue;
    }

    &:active {
        background: $button-active-blue;
    }
}
</style>