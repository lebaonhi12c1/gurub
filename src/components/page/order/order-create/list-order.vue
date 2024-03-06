<script>
import { coursesComputed } from '../../../../state/helpers';
import { convertNumber } from '../../../../helpers/utils';

import cardListOrder from './card-list-order.vue';
    export default {

        props: {
            step: {
                type: Number,
                default: 1
            },
            customers: {
                type: Array,
                default: () => []
            }
        },

        components: { cardListOrder },
        computed: {
            ...coursesComputed
        },

        methods: {  
            _convertNumber(number) {
                return convertNumber(number)
            },
            getTotal(list) {
                return list?.reduce((total, item) => {
                    return Number(total) + Number(item.discounted_price)
                },0)
            },

            getTotalCourse(list){
                return list?.reduce((total, item) => {
                    return total + this.getTotal(item.courses)
                },0)
            },

            getVAT(){
                return this.getTotalCourse(this.customers) * 0.08
            },
        }
    }
</script>

<template>
    <div  style="height: calc(100vh - 550px);" data-simplebar>
        <div v-for="(item, index) in course_list" :key="index">
            <card-list-order :data="item" :step="step"/>
        </div>
    </div>
    <div class="d-flex flex-column gap-2 border-top border-bottom py-3">
        <div class="d-flex justify-content-between">
            Số lượng khóa học đã chọn: <span>x{{ course_list.length }}</span>
        </div>
        <div class="d-flex justify-content-between">
            Tổng cộng: <span>{{ _convertNumber(getTotalCourse(customers))}}đ</span>
        </div>
        <div class="d-flex justify-content-between">
            VAT (8%): <span>{{_convertNumber(getVAT())}}đ</span>
        </div>
        <div class="d-flex justify-content-between">
            Đã giảm: <span>0</span>
        </div>
    </div>
    <div class="d-flex justify-content-between fs-4 mt-3">
        Tổng học phí: <span class="text-danger">{{ _convertNumber(getTotalCourse(customers) + getVAT())}}đ</span>
    </div>
</template>


<style lang="scss" scoped>

</style>