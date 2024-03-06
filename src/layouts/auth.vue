
<script>
        export default {

        }
</script>

<template>
        <div class="auth-page-wrapper position-fixed top-0 right-0 left-0 bottom-0 d-flex align-items-center justify-content-center"
                style="width: 100vw; height:100vh;"
        >
                <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
                        <div class="bg-overlay"></div>
                        <div class="shape" >

                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        viewBox="0 0 1440 120">
                                        <path 
                                                d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z">
                                        </path>
                                </svg>
                        </div>
                </div>

                <div class="w-100 h-100" style="z-index:60;"
                        data-simplebar
                >
                        <div class="auth-page-content">
                                <slot></slot>
                        </div>
                </div>

                <!-- <footer class="footer">
                        <b-container>
                                <b-row>
                                        <b-col lg="12">
                                                <div class="text-center">
                                                        <p class="mb-0 text-muted">
                                                                &copy; {{ new Date().getFullYear() }} Velzon. Crafted with
                                                                <i class="mdi mdi-heart text-danger"></i> by Themesbrand
                                                        </p>
                                                </div>
                                        </b-col>
                                </b-row>
                        </b-container>
                </footer> -->
        </div>
</template>

<style lang="scss" scoped></style>