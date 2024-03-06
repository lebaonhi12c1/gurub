<script>
import get from 'lodash/get';

import { converTimestampToDate, convertNumber } from '../../../../helpers/utils';

import courseTyp from '../../../../config/type/course-typ';

import { coursesMethods } from '../../../../state/helpers';

import avatar from '../../../ui/avatar/avatar.vue'
import Text from '../../../ui/text.vue';

    export default {
        components: { 
            avatar, 
            Text 
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            step: {
                type: Number,
                default: 1
            }
        },

        data() {
            return {
                courseTyp,
            }
        },

        methods: {
            ...coursesMethods,
            _get(item, ref, auto = null) {
                return get(item, ref, auto)
            },

            _converTimestampToDate(date) {
                return converTimestampToDate(date)
            },

            _convertNumber(number) {
                return convertNumber(number)
            },

            handleRemoveCourse(id) {
                this.removeCourse(id)
            }
        }
    }
</script>

<template>
    <b-card class="shadow-none border mb-3">
        <b-row>
            <b-col lg="3">
               <div class="border border-primary rounded-circle" style="width:fit-content;">
                    <avatar size="md"
                        :name="_get(data, 'name', '')"
                        :src="_get(courseTyp, _get(data, 'type', '') + '.logo','')"
                    />
               </div>
            </b-col>
            <b-col lg="9">
                <b-row>
                    <b-col lg="9">
                        <div :class="_get(courseTyp, _get(data, 'type', '') + '.class','')">
                            <Text :text="_get(data, 'name', '')" css="fs-6 text-uppercase"/>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            Ngày khai giảng: <Text :text="_converTimestampToDate(_get(data, 'start_date', ''))"/>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            Giá: <Text :text="_convertNumber(_get(data, 'discounted_price', '')) + 'đ'" css="text-danger"/>
                        </div>
                    </b-col>
                    <b-col lg="3">
                        <b-button variant="danger" size="sm" v-b-tooltip.hover="{title: 'Xóa'}"
                            :disabled="step!=1"
                            @click="handleRemoveCourse(_get(data, 'id',''))"
                        >
                            <i class='bx bx-trash'></i>
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-card>
</template>

<style lang="scss" scoped>

</style>