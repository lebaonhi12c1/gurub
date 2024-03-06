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
import Modal from "../modal/modal.vue";
import Text from "../text.vue";

import vi from '@fullcalendar/core/locales/vi'
export default {
    props: {
        events: {
            type: Array,
            default: () => []
        }
    },

    components: {
        FullCalendar,
        Modal,
        Text
    },
    setup() {

    },

    data() {
        return {
            statusLession,
            calendarOptions:{
                locale: vi,
                timeZone: "local",
                droppable: true,
                navLinks: true,
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    bootstrapPlugin,
                    listPlugin,
                ],
                themeSystem: "bootstrap",
                headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                },
                buttonText: {
                    today: 'Hôm nay',
                    month: 'Tháng',
                    list: 'Danh sách',
                    week: 'Tuần',
                    day: 'Ngày',
                },
                allDayText:"Tất cả",

                windowResize: () => {
                    this.getInitialView();
                },
                initialView: this.getInitialView(),
                events: this.$props.events,
                editable: false,
                selectable: false,
                selectMirror: false,
                dayMaxEvents: true,
                weekends: true,
                // dateClick: this.dateClicked,
                eventClick: this.editEvent,
                // eventsSet: this.handleEvents,
            },
            eventModal: false,
            lesson_info: {},
        }
    },

    computed: {
        options: {
            get() {
                return {
                    ...this.calendarOptions,
                    events: this.$props.events
                }
            }
        }
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

        editEvent(info) {
            this.eventModal = true
            this.lesson_info = info
        },

        openModal() {
            this.eventModal = true;
        },
        closeModal() {
            this.eventModal = false;
        },

        getTime(date){
            const date_convert = this._converTimestampToDateHMS(date)
            if(this._isEmpty(date_convert)) return ''
            const convert = date_convert.split(' ')
            return convert[1]
        }
    },

}
</script>


<template>
    <div>
        <FullCalendar :options="options"/>
        <Modal :eventModal="eventModal" @update:eventModal="eventModal = $event" title="Thông tin buổi học">
            <div>
               <div class="d-flex aling-items-center gap-2 fs-4 mb-3 fw-semibold"> 
                    Tên:
                    <Text :text=" _get(lesson_info, 'event.title')" css="fs-4 mb-3 fw-semibold"/>
                </div>
                  <!-- <div class="d-flex aling-items-center gap-2 mb-2">
                    <div>
                        <i class='fs-4 text-info bx bx-code' ></i>
                    </div>
                    <div class="fw-semibold" style="min-width: 150px;">
                        Mã buổi học:    
                    </div>
                    <div class="text-info">
                        {{ _get(lesson_info, 'event.extendedProps.id') || 'Đang cập nhật' }}
                    </div>
                </div> -->
                  <div class="d-flex aling-items-center gap-2 mb-2">
                    <div>
                        <i class='fs-4 bx bx-book-bookmark'></i>
                    </div>
                    <div class="fw-semibold" style="min-width: 150px;">
                        Khóa học:
                    </div>
                    <div>
                        <Text :text="_get(lesson_info, 'event.extendedProps.course.name')"/>
                    </div>
                </div>
                  <div class="d-flex aling-items-center gap-2 mb-2">
                    <div>
                        <i class='fs-4 bx bx-user' ></i>
                    </div>
                    <div class="fw-semibold" style="min-width: 150px;">
                        Giảng viên:
                    </div>
                    <div>
                        <Text :text="_get(lesson_info, 'event.extendedProps.instructor.display_name')"/>
                        <Text v-if="!_isEmpty(_get(lesson_info, 'event.extendedProps.instructor.email'))"  css="italic text-muted"
                            :text="_get(lesson_info, 'event.extendedProps.instructor.email')" 
                        />
                        <Text v-if="!_isEmpty(_get(lesson_info, 'event.extendedProps.instructor.email'))"
                            :text="_get(lesson_info, 'event.extendedProps.instructor.phone')" css="italic text-muted"/>
                    </div>
                </div>
                  <div class="d-flex aling-items-center gap-2 mb-2">
                    <div>
                        <i class='fs-4 bx bx-heading' ></i>
                    </div>
                    <div class="fw-semibold" style="min-width: 150px;">
                        Chủ đề:
                    </div>
                    <div>
                        <Text :text="_get(lesson_info, 'event.extendedProps.topic.name')"/>
                        <div class="d-flex align-items-center gap-2 italic text-muted">
                            Lý thuyết:
                            {{ lesson_info.extendedProps }}
                            <Text :text="_get(lesson_info, 'event.extendedProps.topic.theory_percent') + '%'"/>
                        </div>
                        <div class="d-flex align-items-center gap-2 italic text-muted">
                            Thực hành:
                            <Text :text="_get(lesson_info, 'event.extendedProps.topic.practice_percent')  + '%'"/>
                        </div>
                        <div class="d-flex align-items-center gap-2 italic text-muted">
                            Chia sẻ thực tế:
                            <Text :text="_get(lesson_info, 'event.extendedProps.topic.actual_share_percent')  + '%'"/>
                        </div>
                    </div>
                </div>
                <div class="d-flex aling-items-center gap-2 mb-2">
                    <div>
                        <i class='bx bx-purchase-tag-alt fs-4' ></i>
                    </div>
                    <div class="fw-semibold" style="min-width: 150px;">
                        Trạng thái:
                    </div>
                    <div class="badge d-flex align-items-center text-uppercase"
                        :class="_get(statusLession, _get(lesson_info, 'event.extendedProps.status') + '.class')"
                    >
                        <Text :text="_get(statusLession, _get(lesson_info, 'event.extendedProps.status') + '.label')"/>
                    </div>
                </div>
                  <div class="d-flex aling-items-center gap-2 mb-2">
                    <div>
                        <i class='fs-4 bx bx-time-five' ></i>
                    </div>
                    <div class="fw-semibold" style="min-width: 150px;">
                        Ngày học:    
                    </div>
                    <div>
                        <Text :text="_converTimestampToDate(_get(lesson_info, 'event.extendedProps.start_date'))" css="text-primary"/>
                    </div>
                </div>
                  <div class="d-flex aling-items-center gap-2 mb-2">
                    <div>
                        <i class='fs-4 bx bx-time-five' ></i>
                    </div>
                    <div class="fw-semibold" style="min-width: 150px;">
                        Ca học:
                    </div> 
                    <div class="d-flex align-items-center gap-2">
                        <Text :text="getTime(_get(lesson_info, 'event.extendedProps.start_date',''))" css="text-danger"/> - 
                        <Text :text="getTime(_get(lesson_info, 'event.extendedProps.end_date',''))" css="text-success"/> 

                    </div>
                </div>
            </div>
        </Modal>
    </div>
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