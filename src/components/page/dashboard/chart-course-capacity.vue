<script>
// { Draggable }
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { converTimestampToDateHMS, converTimestampToDate } from "../../../helpers/utils";

import statusLession from '../../../config/status/status-lession'

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/vue3";
import CourseService from '../../../services/course.service';
import zoneType from '../../../config/type/zone-type';
export default {
    components: {
        FullCalendar,
    },
    setup() {

    },

    data() {
        return {
            statusLession,
            zoneType,
            calendarOptions:{
                height: 'auto',
                locale: 'vi',
                locales: 'vi',
                timeZone: "local",
                droppable: true,
                navLinks: false,
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    bootstrapPlugin,
                    listPlugin,
                ],
                themeSystem: "bootstrap",
                headerToolbar: {
                    right: "prev,next",
                    left: "title"
                },
                titleFormat:{
                    year: 'numeric', month: 'numeric'
                },
                
                buttonText: {
                    month: 'Tháng',
                },
                allDayText:"Tất cả",

                windowResize: () => {
                    this.getInitialView();
                },
                initialView: this.getInitialView(),
                events: [],
                editable: false,
                selectable: false,
                selectMirror: false,
                weekends: true,
                // dateClick: this.dateClicked,
                // eventClick: this.editEvent,
                showNonCurrentDates: true,
                // dayCellContent: { html: '' },
                // eventsSet: this.handleEvents,
                dayMaxEvents: false,
                fixedWeekCount: false,
            },
            eventModal: false,
            lesson_info: {},
            postionX: 0,
            postionY: 0,
            course_info: {},
            course_health: {
                danger: 'p-0 bg-danger',
                warning: 'p-0 bg-warning',
                primary: 'p-0 bg-primary',
                success: 'p-0 bg-success',
            }
        }
    },

    // computed: {
    //     options: {
    //         get() {
    //             return {
    //                 ...this.calendarOptions,
    //                 events: [
    //                     {
    //                         id: 136,
    //                         title: 'Google Ads HN Cơ Bản',
    //                         start: new Date('2023-10-30'),
    //                         end: new Date('2023-11-22'),
    //                         allDay: false,
    //                         // className: 'bg-soft-warning',
    //                         className: 'p-0 bg-primary',
    //                         extendedProps: {
    //                             department: 'Long Event'
    //                         },
    //                         description: 'Long Term Event means an incident that last longer than 12 hours.'
    //                     },
    //                     {
    //                         id: 999,
    //                         title: 'Facebook Ads HN Nâng Cao',
    //                         start: new Date('2023-10-30'),
    //                         end: new Date('2023-11-11'),
    //                         allDay: false,
    //                         // className: 'bg-soft-danger',
    //                         location: 'California, US',
    //                         className: 'p-0 bg-danger',
                            
    //                         extendedProps: {
    //                             department: 'Meeting with Alexis'
    //                         },
    //                         description: 'A meeting is a gathering of two or more people that has been convened for the purpose of achieving a common goal through verbal interaction, such as sharing information or reaching agreement.'
    //                     },
    //                     {
    //                         id: 991,
    //                         title: 'Google Ads HCM Cơ Bản',
    //                         start: new Date('2023-11-30'),
    //                         end: new Date('2023-12-11'),
    //                         allDay: false,
    //                         // className: 'bg-soft-primary',
    //                         location: 'Las Vegas, US',
    //                         className: 'p-0 bg-warning',
                            
    //                         extendedProps: {
    //                             department: 'Repeating Event'
    //                         },
    //                         description: 'A recurring or repeating event is simply any event that you will occur more than once on your calendar. ',
    //                     },
    //                     {
    //                         id: 113,
    //                         title: 'Facebook Ads ONL Cơ Bản',
    //                         start: new Date('2023-11-20'),
    //                         end: new Date('2023-11-27'),
    //                         allDay: false,
    //                         // className: 'bg-soft-danger',
    //                         location: 'Head Office, US',
    //                         className: 'p-0 bg-warning',
    //                         extendedProps: {
    //                             department: 'Lunch'
    //                         },
    //                         description: 'Strategies for Creating Your Weekly Schedule'
    //                     },
    //                     {
    //                         id: 783,
    //                         title: 'Facebook SV ONL Nâng Cao',
    //                         start: new Date('2023-11-04'),
    //                         end: new Date('2023-11-23'),
    //                         url: 'http://google.com/',
    //                         className: 'p-0 bg-success',
    //                         // className: 'bg-soft-dark',
    //                     },
    //                     {
    //                         id: 456,
    //                         title: 'Google ONL Nâng Cao',
    //                         start: new Date('2023-12-09'),
    //                         end: new Date('2023-12-26'),
    //                         allDay: false,
    //                         // className: 'bg-soft-info',
    //                         location: 'Head Office, US',
    //                         className: 'p-0 bg-primary',
    //                         extendedProps: {
    //                             department: 'Discussion'
    //                         },
    //                         description: 'Tell how to boost website traffic'
    //                     }
    //                 ]
    //             }
    //         }
    //     }
    // },

    mounted() {
        this.getCourses()
    },
    
    methods: {
        _get(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },

        _isEmpty(obj) {
            return isEmpty(obj);
        },
        _converTimestampToDate(timestamp) {
            return converTimestampToDate(timestamp)
        },
        _converTimestampToDateHMS(timestamp) {
            return converTimestampToDateHMS(timestamp);
        },

        getInitialView() {
            if (window.innerWidth >= 768 && window.innerWidth < 1200) {
                return "timeGridWeek";
            } else if (window.innerWidth <= 768) {
                return "listMonth";
            } else {
                return "dayGridMonth";
            }
        },

        // editEvent(info) {
        //     this.eventModal = true
        //     this.lesson_info = info
        // },

        // openModal() {
        //     this.eventModal = true;
        // },
        // closeModal() {
        //     this.eventModal = false;
        // },

        getTime(date){
            const date_convert = this._converTimestampToDateHMS(date)
            if(this._isEmpty(date_convert)) return ''
            const convert = date_convert.split(' ')
            return convert[1]
        },

        handleHover(info,event) {
            this.course_info = info
            this.postionX = event.clientX + 20
            this.postionY = event.clientY
        },

        getHealthCourse({total, used}) {
            const health = Math.floor((Number(used) / Number(total)) * 100)
            if(health <= 0 && health < 25){
                return 'danger'
            }
            if(health <= 25 && health < 51){
                return 'warning'
            }
            if(health <= 51 && health < 81){
                return 'primary'
            }
            return 'success'
        },
        async getCourses() {
            this.isLoading = true;
            const res = await CourseService.getCourses({
                filters: [
                    {
                        name: 'stage',
                        operator: '=',
                        value: 'open'
                    },
                    {
                        name: 'status',
                        operator: '=',
                        value: 'publish'
                    },
                ],
                pagination: {
                    page: 1,
                    limit: 200
                }
            })
            this.isLoading = false;
            this.calendarOptions.events = this._get(res, 'data.data',[]).map(item => ({
                id: item.id,
                title: item.name,
                start: new Date(item.start_date * 1000),
                end: new Date(item.end_date * 1000),
                className: this._get(this.course_health, this.getHealthCourse(item.capacity)),
                extendedProps: item,
            }))
        },
    },
}
</script>


<template>
        <b-card no-body>
            <b-card-header>
                <b-card-title  class="mb-0 flex-grow-1 text-uppercase">
                    TÌNH TRẠNG SỨC CHỨA
                </b-card-title>
            </b-card-header>
                <div style="height: 412px" data-simplebar class="px-3 mt-2">
                    <FullCalendar :options="calendarOptions">
                        <template v-slot:eventContent="arg">
                            <div class="container"
                                @mousemove="e=>handleHover(arg.event, e)"
                                @mouseleave="()=>course_info = {}"
                            >
                                <div>
                                    {{ arg.event.title }}
                                </div>
        
                            </div>
                        </template>
                    </FullCalendar>
                </div>
                <!-- <div class="d-flex mt-3 gap-2 flex-wrap">
                    <div class="d-flex align-items-center gap-2 fs-12">
                        <div class="bg-danger rounded-circle" style="width: 20px; height: 20px;">
                            
                        </div>
                        Ít học viên ( từ trên 0% - 25% học viên / khóa học)
                    </div>
                    <div class="d-flex align-items-center gap-2 fs-12">
                        <div class="bg-warning rounded-circle" style="width: 20px; height: 20px;">
                            
                        </div>
                        Thiếu học viên ( đạt từ trên 25% - 60% học viên / khóa học)
                    </div>
                    <div class="d-flex align-items-center gap-2 fs-12">
                        <div class="bg-primary rounded-circle" style="width: 20px; height: 20px;">
                            
                        </div>
                        Sắp đầy ( đạt từ trên 60% - 80% học viên / khóa học)
                    </div>
                    <div class="d-flex align-items-center gap-2 fs-12">
                        <div class="bg-success rounded-circle" style="width: 20px; height: 20px;">
                            
                        </div>
                        Đủ học viên ( đạt từ trên 80% - 100% học viên / khóa học)
                    </div>
                </div> -->
                <b-card-footer>
                    <div class="position-relative" style="margin: 28px 0px">
                         <BProgress style="margin-top: -4px">
                             <BProgressBar :value="25" variant="danger"/>
                             <BProgressBar :value="25" variant="warning" />
                             <BProgressBar :value="25" variant="primary" />
                             <BProgressBar :value="25" variant="success" />
                         </BProgress>
                         <b-badge variant="danger" style="position: absolute; font-size: 12px; bottom: -25px; left: 0;">
                             Ít học viên: 0 - 25%
                             <div style="position: absolute; bottom: 100%; left: 5px; border: 5px solid; border-color: transparent transparent #FA896B transparent">
     
                             </div>
                         </b-badge>
                         <b-badge variant="warning" style="position: absolute; font-size: 12px; top: -25px; right: 50%;">
                             Thiếu học viên: 26% - 50%
                             <div style="position: absolute; top: 100%; right: 5px; border: 5px solid; border-color: #F7B84B transparent transparent transparent">
     
                             </div>
                         </b-badge>
                         <b-badge variant="primary" style="position: absolute; font-size: 12px; bottom: -25px; left: 50%;">
                             Gần đủ học viên: 51% - 80%
                             <div style="position: absolute; bottom: 100%; left: 5px; border: 5px solid; border-color: transparent transparent #5EA3CB transparent">
     
                             </div>
                         </b-badge>
                         <b-badge variant="success" style="position: absolute; font-size: 12px; top: -25px; right: 0;">
                             Đủ học viên: > 81%
                             <div style="position: absolute; top: 100%; right: 5px; border: 5px solid; border-color: #6ADA7D transparent transparent transparent">
     
                             </div>
                         </b-badge>
                    </div>
                </b-card-footer>
        </b-card>
    <b-card
    class="shadow-lg"
        :style="{
            position: 'fixed',
            top: postionY + 'px', 
            left: postionX + 'px',
            display: _isEmpty(course_info) ? 'none' : 'block',
            zIndex: 1000
        }"
    >
        <div class="d-flex align-items-center gap-2">
            Khóa học: <b class=" text-danger">{{_get(course_info, 'title')}}</b>
        </div>
        <div class="d-flex align-items-center gap-2">
            Đã đăng ký: <b class=" text-primary">{{_get(course_info.extendedProps, 'capacity.used')}}</b>
        </div>
        <div class="d-flex align-items-center gap-2">
            Sức chứa: <b class=" text-primary">{{_get(course_info.extendedProps, 'capacity.total')}}</b>
        </div>
        <div class="d-flex align-items-center gap-2">
            Giảng viên: <b>{{_get(course_info.extendedProps, 'instructor.display_name')}}</b>
        </div>
        <div class="d-flex align-items-center gap-2">
            Ngày khai giảng: <b>{{_converTimestampToDate(_get(course_info.extendedProps, 'start_date'))}}</b>
        </div>
        <div class="d-flex align-items-center gap-2">
            Địa điểm: <b>{{_get(zoneType,_get(course_info.extendedProps, 'zone'))}}</b>
        </div>
    </b-card>
</template>

<style lang="scss" scoped>
</style>

<!-- [
    {
        id: 153,
        title: 'All Day Event',
        start: new Date(y, m, 1),
        className: 'bg-soft-primary',
        location: 'San Francisco, US',
        allDay: false,
        
        extendedProps: {
            department: 'All Day Event'
        },
        description: 'An all-day event is an event that lasts an entire day or longer'
    },
    {
        id: 136,
        title: 'Visit Online Course',
        start: new Date(y, m, d - 5),
        end: new Date(y, m, d - 2),
        allDay: false,
        className: 'bg-soft-warning',
        
        extendedProps: {
            department: 'Long Event'
        },
        description: 'Long Term Event means an incident that last longer than 12 hours.'
    },
    {
        id: 999,
        title: 'Client Meeting with Alexis',
        start: new Date(y, m, d + 22, 20, 0),
        end: new Date(y, m, d + 24, 16, 0),
        allDay: false,
        className: 'bg-soft-danger',
        location: 'California, US',
        extendedProps: {
            department: 'Meeting with Alexis'
        },
        description: 'A meeting is a gathering of two or more people that has been convened for the purpose of achieving a common goal through verbal interaction, such as sharing information or reaching agreement.'
    },
    {
        id: 991,
        title: 'Repeating Event',
        start: new Date(y, m, d + 4, 16, 0),
        end: new Date(y, m, d + 9, 16, 0),
        allDay: false,
        className: 'bg-soft-primary',
        location: 'Las Vegas, US',
        extendedProps: {
            department: 'Repeating Event'
        },
        description: 'A recurring or repeating event is simply any event that you will occur more than once on your calendar. ',
    },
    {
        id: 112,
        title: 'Meeting With Designer',
        start: new Date(y, m, d, 12, 30),
        allDay: false,
        className: 'bg-soft-success',
        location: 'Head Office, US',
        extendedProps: {
            department: 'Meeting'
        },
        description: 'Tell how to boost website traffic'
    },
    {
        id: 113,
        title: 'Weekly Strategy Planning',
        start: new Date(y, m, d + 9),
        end: new Date(y, m, d + 11),
        allDay: false,
        className: 'bg-soft-danger',
        location: 'Head Office, US',
        extendedProps: {
            department: 'Lunch'
        },
        description: 'Strategies for Creating Your Weekly Schedule'
    },
    {
        id: 875,
        title: 'Birthday Party',
        start: new Date(y, m, d + 1, 19, 0),
        allDay: false,
        className: 'bg-soft-success',
        location: 'Los Angeles, US',
        extendedProps: {
            department: 'Birthday Party'
        },
        description: 'Family slumber party – Bring out the blankets and pillows and have a family slumber party! Play silly party games, share special snacks and wind down the fun with a special movie.'
    },
    {
        id: 783,
        title: 'Click for Google',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'http://google.com/',
        className: 'bg-soft-dark',
    },
    {
        id: 456,
        title: 'Velzon Project Discussion with Team',
        start: new Date(y, m, d + 23, 20, 0),
        end: new Date(y, m, d + 24, 16, 0),
        allDay: false,
        className: 'bg-soft-info',
        location: 'Head Office, US',
        extendedProps: {
            department: 'Discussion'
        },
        description: 'Tell how to boost website traffic'
    }
] -->