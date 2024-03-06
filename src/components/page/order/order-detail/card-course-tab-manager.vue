<script>

    import courseTyp from '../../../../config/type/course-typ';
    import courseLevel from '../../../../config/type/course-level';
    import zoneType from '../../../../config/type/zone-type';

    import { converTimestampToDate, convertNumber } from '../../../../helpers/utils';

    import get from 'lodash/get';

    import placeholderWraper from '../../../ui/placeholder-wraper.vue';
    import Text from '../../../ui/text.vue';
    import Avatar from '../../../ui/avatar/avatar.vue';
    export default {
        props: {
            isLoadingCourses: {
                type: Boolean,
                default: false
            },

            item: {
                type: Object,
                default: () => ({})
            }
        },

        components: {
            placeholderWraper,
            Text,
            Avatar,
        },

        data() {
            return {
                courseTyp,
                show_detail: false,
                courseLevel,
                zoneType,
            }
        },

        methods: {

            _get(core, item, defaultVal = '') {
                return get(core, item, defaultVal);
            },
            _converTimestampToDate(date) {
                return converTimestampToDate(date);
            },

            _convertNumber(number) {
                return convertNumber(number);
            },


            handleChangeCourse(item) {
                this.$emit('handleChangeCourse', item);
            }
        }
    }
</script>


<template>
    <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
            <placeholder-wraper :isLoading="isLoadingCourses">
                <avatar :src="_get(courseTyp, _get(item, 'type', '') + '.logo', '')" size="md" :thumbnail="true"/>
            </placeholder-wraper>
            <div>
                <placeholder-wraper :isLoading="isLoadingCourses">
                    <h6 class="text-uppercase">{{ _get(item, 'name', '') }}</h6>
                </placeholder-wraper>
                <placeholder-wraper :isLoading="isLoadingCourses">
                    <div>Ngày khai giảng: {{ _converTimestampToDate(_get(item, 'start_date', '')) }}</div>
                </placeholder-wraper>
                <placeholder-wraper :isLoading="isLoadingCourses">
                    <div class="d-flex align-items-center gap-2">Sức chứa:
                        <Text :text="_get(item, 'capacity.total', '')"/>
                    </div>
                </placeholder-wraper>
                <placeholder-wraper :isLoading="isLoadingCourses">
                    <div class="d-flex align-items-center gap-2">Đã đăng ký:
                        <Text :text="_get(item, 'capacity.used', '')"/>
                    </div>
                </placeholder-wraper>
                <div class="cursor-pointer text-info" v-if="!show_detail"
                    @click="show_detail=true"
                >
                    Xem chi tiết
                </div>
                <div class="cursor-pointer text-danger" v-else
                    @click="show_detail=false"
                >
                    Ẩn bớt
                </div>
            </div>
        </div>
        <div class="d-flex flex-column align-items-end"
        >
            <placeholder-wraper :isLoading="isLoadingCourses">
                <Text :text=" _convertNumber(_get(item, 'discounted_price')) + 'đ'" css="text-danger fw-medium"/>
            </placeholder-wraper>
            <placeholder-wraper :isLoading="isLoadingCourses">
                <div style="text-decoration: line-through"> 
                    <Text :text=" _convertNumber(_get(item, 'original_price')) + 'đ'"/>
                </div>
            </placeholder-wraper>
            <b-button size="sm"
                @click="handleChangeCourse(item)"
            >                           
                Chọn
            </b-button>
        </div>
    </div>
    <div v-if="show_detail" class="border-top py-3 mt-3">
        <b-row>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2">
                    <div class="fw-medium">
                        Cấp độ:
                    </div>
                    <Text :text="_get(courseLevel,_get(item, 'level', ''))"/>
                </div>

            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2">
                    <div class="fw-medium">
                        Địa điểm:
                    </div>
                    <Text :text="_get(zoneType,_get(item, 'zone', ''))"/>
                </div>  

            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2">
                    <div class="fw-medium">
                        Hình thức:
                    </div>
                    <Text :text="_get(item, 'method') == 'offline' ? 'Offline' : 'Online'"/>
                </div>  

            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2">
                    <div class="fw-medium">
                        Giảng viên:
                    </div>
                    <Text :text="_get(item, 'instructor.display_name') "/>
                </div>  

            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2">
                    <div class="fw-medium">
                        Khai giảng:
                    </div>
                    <Text :text="_converTimestampToDate(_get(item, 'start_date')) "/>
                </div>  

            </b-col>
            <b-col lg="6">
                <div class="d-flex align-items-center gap-2">
                    <div class="fw-medium">
                        Kết thúc:
                    </div>
                    <Text :text="_converTimestampToDate(_get(item, 'end_date')) "/>
                </div>  

            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>

</style>