<script>
import cardCourse from './card-course.vue'
import filterContainer from '../../../ui/filter/filterContainer.vue'

import CourseService from '../../../../services/course.service'

import config from '../../../../config/filter/field/course-fields'

import _get from 'lodash/get'

import { coursesComputed } from '../../../../state/helpers'
import NoresultTable from '../../../ui/noresult-table.vue'

export default {
    components: { 
        cardCourse,
        filterContainer,
        NoresultTable
    },

    data() {
        return {
            config,
            courses: [],
            isLoading: false,
            filters: [],
            orders: [],
        }
    },

    computed: {
        ...coursesComputed
    },

    methods: {
        _get(obj, path, defaultValue = null) {
            return _get(obj, path, defaultValue)
        },
        handleNextStep() {
            this.$emit('nextStep', 2)
        },
        async getCourses() {
            this.isLoading = true
            const res = await CourseService.getCourses({
                filters: this.filters.concat([
                    {
                        name: 'status',
                        operator: '=',
                        value: 'publish'
                    },
                    {
                        name: 'capacity_remain',
                        operator: '>',
                        value: 0
                    },
                ]),
                orders: this.orders,
                pagination: {
                    page: 1,
                    limit: 200,
                }
            })
            this.courses = this._get(res, 'data.data')
            this.isLoading = false
        },

        handleFilter(value) {
            this.filters = this._get(value, 'filters')
            this.orders = this._get(value, 'orders')
            this.getCourses()
        },

    },

    mounted() {
        this.getCourses()
    }
}
</script>

<template>
    <div class="tab-pane fade show active" role="tabpanel" aria-labelledby="pills-gen-info-tab">
        <div class="mb-3">
            <filter-container :config="config" @handleFilter="handleFilter"/>
        </div>
        <div style="height: calc(100vh - 436px);" data-simplebar>
            <div class="mb-3"
               v-for="(item, index) in courses" :key="index"
            >
                <card-course :isLoading="isLoading" :data="item"/>
            </div>
            <noresult-table v-if="courses.length < 1"/>
        </div>
        <div class="d-flex align-items-start gap-3 mt-4">
            <b-button type="button" variant="success" class="btn-label right ms-auto nexttab
nexttab" data-nexttab="pills-info-desc-tab"
                :disabled="_get(courses, 'length') < 1 || course_list.length < 1"
                @click="handleNextStep"
            >
                <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
            Tiếp tục
            </b-button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>