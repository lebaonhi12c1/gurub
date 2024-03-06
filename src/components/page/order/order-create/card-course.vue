
<script>
import { convertNumber } from '../../../../helpers/utils';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import courseTyp from '../../../../config/type/course-typ'
import zoneType from '../../../../config/type/zone-type';
import courseLevel from '../../../../config/type/course-level';

import { converTimestampToDate } from '../../../../helpers/utils';

import { coursesMethods, coursesComputed } from '../../../../state/helpers';

import avatar from '../../../ui/avatar/avatar.vue'
import PlaceholderWraper from '../../../ui/placeholder-wraper.vue'
import Text from '../../../ui/text.vue'


    export default {

        props: {
            isLoading: {
                type: Boolean,
                default: false,
            },
            data: {
                type: Object,
                default: () => ({})
            }
        },

        components: { 
            avatar, 
            PlaceholderWraper,
            Text,
        },
        
        data() {
            return {
                courseTyp,
                zoneType,
                courseLevel,
                is_detail: false,
            }
        },

        computed: {
            ...coursesComputed
        },

        methods: {
            ...coursesMethods,

            _get( item, ref, auto = null) {
                return get(item, ref, auto);
            },
            _isEmpty(item) {
                return isEmpty(item);
            },
            _convertNumber(number) {
                return convertNumber(number);
            },

            _converTimestampToDate(date) {
                return converTimestampToDate(date);
            },

            checkCourseExit(id) {
                return this._isEmpty(this.course_list.find(item => item.id === id))
            },

            handleAddCourse(value) {
                this.addCourse(value)
            }
        },

    }

    
</script>

<template>
    <b-card class="ribbon-box border shadow-none mb-lg-0">

        <!-- <div class="ribbon-two ribbon-two-primary"><span>Primary</span></div> -->
        <b-row>
            <b-col lg="2">
                <placeholder-wraper :isLoading="isLoading">
                   <div 
                   >
                        <avatar size="lg" thumbnail
                            :name="_get(data,'name','')"
                            :src="_get(courseTyp, _get(data,'type') + '.logo', '')"
                        />
                   </div>
                </placeholder-wraper>
            </b-col>
            <b-col lg="10">
                <b-row>
                    <b-col lg="9">
                        <placeholder-wraper :isLoading="isLoading">
                            <div :class="_get(courseTyp, _get(data,'type') + '.class','')">
                                <Text css="fs-5 text-uppercase fw-semibold"
                                    :text="_get(data,'name','')"
                                />
                            </div>
                        </placeholder-wraper>
                        <div class="d-flex align-items-center gap-1">
                            Ngày khai giảng:
                            <placeholder-wraper :isLoading="isLoading">
                                <Text css="text-muted"
                                    :text="_converTimestampToDate(_get(data,'start_date',''))"
                                />
                            </placeholder-wraper>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            Sức chứa:
                            <placeholder-wraper :isLoading="isLoading">
                                <Text css="text-muted"
                                    :text="_get(data, 'capacity.total', 0)"
                                />
                            </placeholder-wraper>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            Đã đăng ký:
                            <placeholder-wraper :isLoading="isLoading">
                                <Text css="text-muted"
                                    :text="_get(data, 'capacity.used', 0)"
                                />
                            </placeholder-wraper>
                        </div>
                        <div class="link-info italic cursor-pointer"
                            v-if="!is_detail"
                            @click="is_detail = true"
                        >
                            Xem chi tiết
                        </div>
                        <div class="link-danger italic cursor-pointer"
                            v-if="is_detail"
                            @click="is_detail = false"
                        >
                            Ẩn bớt
                        </div>
                    </b-col>
                    <b-col lg="3">
                        <div class="d-flex align-items-end flex-column">
                            <placeholder-wraper :isLoading="isLoading">
                                <Text :text="_convertNumber(_get(data,'discounted_price',0)) + 'đ'" css="fs-4 text-danger fw-semibold"/>
                            </placeholder-wraper>
                            <placeholder-wraper :isLoading="isLoading">
                               <div style="text-decoration: line-through;"> 
                                    <Text :text="_convertNumber(_get(data,'original_price',0)) + 'đ'" css="fs-6 fw-semibold text-muted"/>
                                </div>
                            </placeholder-wraper>
                            <b-button variant="primary" size="sm" class="mt-3"
                                :disabled="!checkCourseExit(_get(data,'id',''))"
                                @click="handleAddCourse(data)"
                            >
                                Chọn
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-if="is_detail" class="border-top mt-3">
           <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Tên khóa:
                    </div>
                    <Text :text="_get(data,'name','')"/>
                </div>
           </b-col>
           <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Cấp độ:
                    </div>
                    <Text :text="_get(courseLevel, _get(data,'level',''))"/>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Địa điểm:
                    </div>
                    <Text :text="_get(zoneType, _get(data,'zone',''))"/>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Loại:
                    </div>
                   <div class="d-flex align-items-center gap-2"> 
                        <avatar :src="_get(courseTyp, _get(data,'type','') + '.logo','')" size="xxs"
                            :name="_get(courseTyp, _get(data,'type','') + '.label','')"
                        />
                        <Text :text="_get(courseTyp,_get(data,'type','') + '.label')"/>
                    </div>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Hình thức:
                    </div>
                    <Text :text="_get(data,'method','') == 'offline' ? 'Offline' : 'Online'"/>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Giá gốc:
                    </div>
                    <Text :text="_convertNumber(_get(data,'original_price','')) + 'đ'" class="text-danger"/>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Giá giảm:
                    </div>
                    <Text :text="_convertNumber(_get(data,'discounted_price','')) + 'đ'" class="text-danger"/>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Giảng viên:
                    </div>
                    <Text :text="_get(data,'instructor.display_name','')"/>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Sức chứa:
                    </div>
                   <div class="d-flex align-items-center gap-2">
                        <Text :text="_get(data,'capacity.total','')"/>
                    </div>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Đã đăng ký:
                    </div>
                   <div class="d-flex align-items-center gap-2">
                        <Text :text="_get(data,'capacity.used','')"/>
                    </div>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Ngày khai giảng:
                    </div>
                    <Text :text="_converTimestampToDate(_get(data,'start_date',''))"/>
                </div>
            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <div class="fw-medium">
                        Ngày kết thúc:
                    </div>
                    <Text :text="_converTimestampToDate(_get(data,'end_date',''))"/>
                </div>
            </b-col>
        </b-row>
    </b-card>
</template>


<style lang="scss" scoped>

</style>