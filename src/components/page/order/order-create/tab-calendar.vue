<script>
import CourseService from '../../../../services/course.service'
import { coursesComputed } from '../../../../state/helpers'

import get from 'lodash/get'

import lesstionType from '../../../../config/type/lesstion-type'

import calendar from '../../../ui/calendar/calendar.vue'
import { converTimestampToDateHMS } from '../../../../helpers/utils'
    export default {
        components: { 
            calendar 
        },

        data() {
            return {
                isLoadingLesstion: false,
                lesstionType,
                events:  [],
            }
        },

        computed: {
            ...coursesComputed
        },

        mounted() {
            this.handleGetEvents(this.course_list)
        },

        methods: {

            _get( item, ref, auto = null ) {
                return get( item, ref, auto )
            },

            _converTimestampToDateHMS(date) {
                return converTimestampToDateHMS(date)
            },
            handlePreStep() {
                this.$emit('nextStep', 1)
            },

            handleNextStep() {
                this.$emit('nextStep', 3)
            },

            async handleGetLesstion(course) {
                const res = await CourseService.getCourseDetailLessons(course.id)
                return this._get(res, 'data', []).map(item =>(
                {
                    id: item.id,
                    title: item.name,
                    start: new Date(item.start_date * 1000),
                    end: new Date(item.end_date * 1000),
                    className: this._get(lesstionType, course.type + '.class','bg-primary text-white'),
                    allDay: false,
                    extendedProps: {
                        ...item,
                        start_date: this._converTimestampToDateHMS(item.start_date) ,
                        end_date: this._converTimestampToDateHMS(item.end_date) ,
                        topic: {
                            name: item.name,
                            theory_percent: item.theory_percent,
                            practice_percent: item.practice_percent,
                            actual_share_percent: item.actual_share_percent,
                        },
                        course: {
                            name: course.name,
                        }
                    },
                }
            ))
            },

            async handleGetEvents(array) {
                this.isLoadingLesstion = true
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    const new_event = await this.handleGetLesstion(element)
                    this.events = this.events.concat(new_event)
                }
                this.isLoadingLesstion = false
            }
        }
        
    }
</script>

<template>
    <div  style="height: calc(100vh - 367px);" data-simplebar>
        <calendar :events="events"/>
        
    </div>
    <div class="d-flex align-items-center justify-content-between gap-3">
        <b-button type="button" variant="light" class="btn-label left nexttab
nexttab" data-nexttab="pills-info-desc-tab"
            @click="handlePreStep"
        >
            <i class="ri-arrow-left-line label-icon align-middle me-2 fs-16"></i>
        Trở lại
        </b-button>
        <b-button type="button" variant="success" class="btn-label right nexttab
nexttab" data-nexttab="pills-info-desc-tab"
            @click="handleNextStep"
        >
            <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
        Tiếp tục
        </b-button>
    </div>
</template>

<style lang="scss" scoped>

</style>