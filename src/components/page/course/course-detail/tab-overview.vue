<script>
import fadeContainer from '../../../ui/fade-container.vue'
import PlaceholderWraper from '../../../ui/placeholder-wraper.vue'
import CardList from '../../../ui/card/card-list.vue'
import Text from '../../../ui/text.vue'
import CardContainer from '../../../ui/card/card-container.vue'
import CardReport from '../../../ui/card/card-report.vue'
import CardReportVer2 from '../../../ui/card/card-report-ver2.vue'
import Calendar from '../../../ui/calendar/calendar.vue'
import { CountTo } from 'vue3-count-to'

import { label_course } from '../../../../config/labels/label-course.js'

import _get from 'lodash/get'

import { convertNumber, converTimestampToDate, converTimestampToDateHMS } from '../../../../helpers/utils'
import CourseService from '../../../../services/course.service'
import courseTyp from '../../../../config/type/course-typ'
import contactType from '../../../../config/type/contact-type'
import Avatar from '../../../ui/avatar/avatar.vue'
export default {

    props: {
        reCallAPIGetDataLessionVar: {
            type: Boolean,
        },
        detail: {
            type: Object,
            default: () => ({})
        }
    },

    components: { 
        fadeContainer, 
        PlaceholderWraper, 
        Text, 
        CardList, 
        CardContainer, 
        CardReport, 
        CardReportVer2,
        CountTo,
        Calendar,
        Avatar,
    },
    data() {
        return {
            isLoadingStaff: false,
            isLoadingLession: false,
            isLoadingDetail: false,
            label_course,
            courseTyp,
            contactType,
            info_detail: {},
            staffs: [],
            events: [],
            lineCount: 0,
            isHiddenBtnSeeMore: false,
            description: this._get(this.info_detail, 'description', ''),
            toggleInputDescription:false,
        }
    },

    methods: {
        _get(item, ref, _default)
        {
            let value = _get(item, ref, _default);

            if(!value)
            {
                value = _default
            }

            return value;
        },

        _convertNumber(value) {
            return convertNumber(value)
        },
        
        _converTimestampToDate(value) {
            return converTimestampToDate(value)
        },
        _converTimestampToDateHMS(value) {
            return converTimestampToDateHMS(value)
        },
        async getCouresDetail() {
            this.isLoadingDetail = true
            const res = await CourseService.getCourseDetail(this.$route.params.id)
            this.info_detail = _get(res, 'data', {})
            this.isLoadingDetail = false

            this.getLesstions()
        },
        async getLesstions() {
            this.isLoadingLession = true
            const res = await CourseService.getCourseDetailLessons(this.$route.params.id)
            this.events = this._get(res, 'data', []).map(item =>(
                {
                    id: this._get(item, 'id',''),
                    title: this._get(item, 'name',''),
                    start: new Date(this._get(item, 'start_date','') * 1000),
                    end: new Date(this._get(item, 'end_date','') * 1000),
                    className: 'bg-primary text-white',
                    allDay: false,
                    extendedProps: {
                        ...item,
                        start_date:this._get(item, 'start_date',''),
                        end_date: this._get(item, 'end_date',''),
                        topic: {
                            name: this._get(item, 'name',''),
                            theory_percent: this._get(item, 'theory_percent',''),
                            practice_percent: this._get(item, 'practice_percent',''),
                            actual_share_percent: this._get(item, 'actual_share_percent',''),
                        },
                        course: {
                            name: this._get(this.info_detail, 'name',''),
                        }
                    },
                }
            ))
            this.isLoadingLession = false
        },
        async getStaffs() {
            this.isLoadingStaff = true
            const res = await CourseService.getCourseDetailStaffs(this.$route.params.id)
            this.staffs = _get(res, 'data',[])
            this.isLoadingStaff = false
        },

        handleOpenForm() {
            this.$emit('onOpenForm')
        },

        countLines() {
            const textContainer = this.$refs.textContainer;
            const lines = textContainer.clientHeight / parseFloat(getComputedStyle(textContainer).lineHeight);
            this.lineCount = Math.floor(lines)
        },

        handleUpdate() {
            this.toggleInputDescription = !this.toggleInputDescription
            this.description = this._get(this.info_detail,'description')
        },

        async applyEdit() {

            const response =  await CourseService.updateCourse(this.$route.params.id, {
                ...this.info_detail,
                description: this.description || ''
            }, this.$route.params.id)

            this.toggleInputDescription = false


            if (!response)
            {
                this.description = this._get(this.info_detail,'description')
                return
            }
            
            
            this.getCouresDetail()
            this.$emit('reCallAPIGetDataDetail',{reCallAPIGetDataDetail: true})

        },

        handleBtnCancel(){
            this.toggleInputDescription = false

        }
    },

    mounted() {
        this.getCouresDetail()
        this.getStaffs()       
    },

    watch:{
        "info_detail":{
            handler: function() {
                // Sử dụng this.$nextTick để đảm bảo DOM đã được cập nhật
                this.$nextTick(() => {
                    this.countLines();
                    this.description = this._get(this.info_detail,'description')

                });
            },
            deep: true,
        },

        "description": {
            handler: function() {
                if(this.description != this._get(this.info_detail,'description'))
                {
                    this.disabledBtnSubmit = false;
                }
                else
                {
                    this.disabledBtnSubmit = true;
                }
            },
            deep: true,
        },

        "reCallAPIGetDataLessionVar":
        {
            handler: async function() {
                this.$nextTick(async() => {
                    this.events = []
                    await this.getLesstions()

                });
              
            },
            deep: true,
        },

        detail: {
            handler: function() {
                this.getCouresDetail()
            },
            deep: true
        },
        
        "toggleInputDescription"() {
            if(!this.toggleInputDescription)
            {
                this.disabledBtnSubmit = true;
            }
        }

        
    },
    
}
</script>

<template>
    <fade-container>
        <b-row>
            <b-col lg="3">
                <b-card no-body>
                    <b-card-header>
                        <div class="d-flex align-items-center justify-content-between">
                            <h5 class="mb-0">Thông tin</h5>
                            <b-button size="sm"
                                @click="handleOpenForm"
                            >
                                <i class="ri-edit-box-line align-bottom"></i>
                                Cập nhật
                            </b-button>
                        </div>
                    </b-card-header>
                    <b-card-body>
                        <div class="table-responsive">
                            <table class="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <th class="ps-0 text-nowrap" scope="row">Mã khóa học:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                <Text :text="String(_get(info_detail, 'code', ''))" css="text-break" />
                                            </placeholder-wraper>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0" scope="row">Tên khóa học:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                
                                                <Text :text="_get(info_detail, 'name', '')" css="text-break"/>
                                            </placeholder-wraper>
                                        </td>
                                    </tr>
                                    <!-- <tr>
                                        <th class="ps-0" scope="row">Giảng viên:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                <Text text="makhoahoc" css="text-break"/>
                                            </placeholder-wraper>
                                        </td>
                                    </tr> -->
                                    <tr>
                                        <th class="ps-0" scope="row">Sức chứa:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                <Text :text="String(_get(info_detail, 'capacity', ''))" css="text-break"/>
                                            </placeholder-wraper>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0" scope="row">Trạng thái:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                               <div class="badge"
                                                    :class="_get(label_course,_get(info_detail, 'status', '') + '.class')"
                                               >
                                                   {{ _get(label_course,_get(info_detail, 'status', '') + '.text') }}
                                               </div>
                                            </placeholder-wraper>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0" scope="row">Giá gốc:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                <Text :text="String(_convertNumber(_get(info_detail, 'original_price', ''))) + 'đ'" css="text-break"/>
                                            </placeholder-wraper>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0" scope="row">Giá đã giảm:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                <Text :text="String(_convertNumber(_get(info_detail, 'discounted_price', ''))) + 'đ'" css="text-danger text-break"/>
                                            </placeholder-wraper>
                                        </td>
                                    </tr>
                                    <tr v-if="_get(info_detail, 'course_category.name')">
                                        <th class="ps-0" scope="row">Giáo trình:</th>
                                        <td class="text-muted">
                                            <b-link :href="'/categories/'+_get(info_detail, 'course_category.id')" class="text-secondary">
                                                <placeholder-wraper :isLoading="isLoadingDetail">
                                                    <Text :text="String(_get(info_detail, 'course_category.name', 'Đang cập nhật'))" css="text-break"/>
                                                </placeholder-wraper>
                                            </b-link>
                                        </td>
                                    </tr>
                                  
                                    <tr>
                                        <th class="ps-0" scope="row">Tình trạng:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                <b-badge 
                                                    :variant="_get(label_course,_get(info_detail, 'stage', '') + '.class')" 
                                                    pill 
                                                >
                                                    {{ _get(label_course,_get(info_detail, 'stage', '') + '.text') }}
                                                </b-badge>
                                            </placeholder-wraper>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0" scope="row">Ngày tạo:</th>
                                        <td class="text-muted">
                                            <placeholder-wraper :isLoading="isLoadingDetail">
                                                <Text :text="_converTimestampToDate(_get(info_detail, 'created_at', ''))" css="text-break"/>
                                            </placeholder-wraper>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </b-card-body>
                </b-card>
                <card-list title="Danh sách nhân viên" link_to_all="/staffs" size_item="xs" max_height="280px" :isLoading="isLoadingStaff" :data="staffs" is_custom_list_item>
                    <template #slot_list_item>
                        <div class="px-3 d-flex flex-column gap-2">
                            <div
                                v-for="(item, index) in staffs" :key="index"
                            >
                                <div class="d-flex align-items-center ">
                                    <placeholder-wraper :isLoading="isLoadingStaff">
                                        <avatar :src="_get(item, 'avatar_url', '')" :name="_get(item,'display_name')" size="sm"/>
                                    </placeholder-wraper>
                                    <div class="ms-3 flex-grow-1">
                                        <h6 class="fs-14 mb-1">
                                            <placeholder-wraper :isLoading="isLoadingStaff">
                                                <Text :text="_get(item,'display_name')"/>
                                            </placeholder-wraper>
                                        </h6>
                                        <p class="mb-0 text-muted">
                                            <placeholder-wraper :isLoading="isLoadingStaff">
                                                <Text :text="_get(item,'email')" css="fs-12"/>
                                            </placeholder-wraper>
                                        </p>
                                        <p class="mb-0 text-muted">
                                            <placeholder-wraper :isLoading="isLoadingStaff">
                                                <Text :text="_get(item,'phone')" css="fs-12"/>
                                            </placeholder-wraper>
                                        </p>
                                        <p class="mb-0 text-muted">
                                            <placeholder-wraper :isLoading="isLoadingStaff">
                                                <div class="d-flex align-items-center gap-2 fs-12" >
                                                    Vai trò:
                                                    <Text :text="_get(contactType, _get(item,'role') + '.label','')"/>
                                                </div>
                                            </placeholder-wraper>
                                        </p>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <h6 class="m-0">
                                            <placeholder-wraper :isLoading="isLoadingStaff">
                                                <router-link v-b-tooltip.hover="{title: 'Xem chi tiết'}" :to="`/staffs/${_get(item,'id')}`">
                                                    <i class='bx bxs-show'></i>
                                                </router-link>
                                            </placeholder-wraper>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </card-list>
            </b-col>
            <b-col lg="9">
               
                <b-card no-body>
                    <b-card-header class="d-flex justify-content-between align-items-center"
                    >
                            <h6 class='d-flex justify-content-center align-items-center'>
                                Mô tả
                            </h6>
                            <b-button size="sm"
                                @click="handleUpdate"
                            >
                                Sửa
                            </b-button>
                    </b-card-header>
                    <b-card-body>
                        <div class="table-responsive table-card p-3">
                            <div 
                    
                            >
                            <placeholder-wraper 
                                :isLoading="isLoadingDetail"
                                v-if="!toggleInputDescription"    
                            >
                                <div 
                                     v-html="_get(info_detail, 'description', 'Chưa mô tả...')" 
                                     ref="textContainer" 
                                     :class="{'line-clamp-10': !isHiddenBtnSeeMore && lineCount >= 10} "
                               
                                 ></div >
                             </placeholder-wraper>
                             <div v-else>
                                <b-form-textarea
                                    id="textarea"
                                    v-model="description"
                                    placeholder="Mô tả..."
                                    rows="4"
                                ></b-form-textarea>
                                <div class="d-flex justify-content-end align-items-center mt-3">
                                    <b-button variant="danger" size="sm" class=" me-2" @click="handleBtnCancel()">
                                        Hủy
                                    </b-button>
                                    <b-button variant="success" size="sm" @click="applyEdit()" :disabled="disabledBtnSubmit">
                                        Áp dụng
                                    </b-button>
                                </div>
                            </div>     
                            </div>
                            <div class="d-flex justify-content-center align-items-center mt-3">
                                <b-button variant="primary" size="sm" v-if="lineCount >= 10 && !isHiddenBtnSeeMore && !toggleInputDescription" @click="isHiddenBtnSeeMore = !isHiddenBtnSeeMore">
                                    Xem thêm mô tả
                                </b-button>
                                <b-button variant="primary" size="sm"  v-if="lineCount >= 10 && isHiddenBtnSeeMore && !toggleInputDescription" @click="isHiddenBtnSeeMore = !isHiddenBtnSeeMore">
                                    Ẩn bớt mô tả
                                </b-button>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
                <b-row>
                    <b-col xl="4" md="12">
                        <CardReport title="Tổng doanh thu" :number="0">
                            <div class="avatar-md d-flex justify-content-center align-items-center rounded bg-soft-success text-success">
                                <i class='bx bx-bitcoin fs-1'></i>
                            </div>
                        </CardReport>

                    </b-col>
                    <b-col xl="4" md="12">
                        <CardReport title="Số lượng học viên" :number="0">
                            <div class="avatar-md d-flex justify-content-center align-items-center rounded bg-soft-warning text-warning">
                                <i class='bx bx-group fs-1' ></i>
                            </div>
                        </CardReport>
                    </b-col>
                    <b-col xl="4" md="12">
                        <card-report-ver-2 title="Chờ phê duyệt" :number="0">
                            <template #slot1>
                                <count-to :startVal="0" :endVal="0" :duration="1000"></count-to>/
                                <count-to :startVal="0" :endVal="0" :duration="1000"></count-to>
                            </template>
                            <template  #slot2>
                                <div class="flex-shrink-0 avatar-md">
                                    <div class="avatar-title bg-soft-info text-info fs-22 rounded">
                                        <i class='bx bx-list-check fs-1'></i>
                                    </div>
                                </div>
                            </template>
                        </card-report-ver-2>
                    </b-col>
                </b-row>
                <card-container title="Lịch buổi học">
                    <div class="placeholder placeholder-glow rounded w-100" style="min-height: 200px;"  v-if="isLoadingLession && events.length == 0"></div>
                    <calendar :events="events" v-else/>
                </card-container>
                
            </b-col>
        </b-row>
    </fade-container>
</template>



<style lang="scss" scoped></style>
