<script>
import PageHeader from '../../../components/page-header.vue'
import TabCourseListInfo from '../../../components/page/order/order-create/tab-course-list-info.vue'
import CardContainer from '../../../components/ui/card/card-container.vue'
import FadeContainer from '../../../components/ui/fade-container.vue'
import ListOrder from '../../../components/page/order/order-create/list-order.vue'
import TabCalendar from '../../../components/page/order/order-create/tab-calendar.vue'
import TabFillInfoCustomer from '../../../components/page/order/order-create/tab-fill-info-customer.vue'
import TabCheckInfo from '../../../components/page/order/order-create/tab-check-info.vue'
import TabFinish from '../../../components/page/order/order-create/tab-finish.vue'

export default {
    components: {
        FadeContainer,
        CardContainer,
        PageHeader,
        TabCourseListInfo,
        ListOrder,
        TabCalendar,
        TabFillInfoCustomer,
        TabCheckInfo,
        TabFinish,
    },

    data() {
        return {
            step: JSON.parse(sessionStorage.getItem('order_create_step')) || 1,
            label: {
                1: 'Thông tin khóa học',
                2: 'Lịch học',
                3: 'Thông tin học viên',
                4: 'Xác nhận thông tin học viên',
                5: 'Hoàn thành',
            },

            customers: JSON.parse(sessionStorage.getItem( 'order_create_customers' )) || [{
                name: '',
                phone: '',
                email: '',
                courses: []
            }],

        }
    },

    methods: {
        nextStep(value) {
            this.step = value
        },

        setCustomers(value){
            this.customers = value
            sessionStorage.setItem('order_create_customers', JSON.stringify(value))
        }
    },

    watch: {
        step: {
            handler(newValue) {
                sessionStorage.setItem('order_create_step', JSON.stringify(newValue))
            },
            deep: true
        },
    }
}
</script>


<template>
    <fade-container>
        <page-header title="đăng ký khóc học"/>
        <b-row>
            <b-col lg="8">
                <b-card no-body>
                    <b-card-header>
                        <b-card-title class="mb-0 text-uppercase">
                            {{ label[step] }}
                        </b-card-title>
                    </b-card-header>
                    <b-card-body>
                        <form class="form-steps" autocomplete="off"> 
                            <div class="tab-content">
                                <tab-course-list-info v-if="step==1" @nextStep="nextStep" />
                                <tab-calendar v-if="step==2" @nextStep="nextStep"/>
                                <tab-fill-info-customer v-if="step==3" @nextStep="nextStep"
                                    @setCustomers="setCustomers"
                                />
                                <tab-check-info v-if="step==4" @nextStep="nextStep"
                                    :customers="customers"
                                />
                                <tab-finish v-if="step==5"/>
                            </div>
                        </form>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col lg="4">
                <card-container title="KHÓA HỌC ĐÃ CHỌN">
                    <list-order :step="step" :customers="customers"/>
                </card-container>
            </b-col>
        </b-row>
        <b-card class="mb-4">
            <div id="custom-progress-bar" class="progress-nav">
                <div class="progress" style="height: 1px;">
                    <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0"
                        aria-valuemin="0" aria-valuemax="100"></div>
                </div>

                <ul class="nav nav-pills progress-bar-tab custom-nav" role="tablist">
                    
                    <li class="nav-item" role="presentation"
                        v-for="index in 5" :key="index"
                    >
                        <b-button pill variant="link" class="nav-link"
                            :class="{
                                'active': index == step
                            }"
                        >
                            {{index}}
                        </b-button>
                    </li>
                </ul>
            </div>
        </b-card>
    </fade-container>
</template>

<style lang="scss" scoped></style>