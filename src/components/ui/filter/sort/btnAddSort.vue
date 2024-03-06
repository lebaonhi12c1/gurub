<script setup>

import { defineProps, defineEmits } from 'vue';
import _get from "lodash/get"
import _isEmpty from 'lodash/isEmpty';

const props = defineProps(['config'])
const emits = defineEmits(['addArraySortItem'])


const addItem = (value) =>
{
    emits("addArraySortItem", value)
}


</script>

<template>
    <div>
        <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none" no-caret>
            <template #button-content>
                <!-- Thêm class 'custom-toggle' để chúng ta có thể chọn phần tử này để ẩn icon -->
                <span class="custom-toggle">Thêm tiêu chí</span>
            </template>
            <b-dropdown-item v-if="_isEmpty( props.config)">Không còn tiêu chí nào</b-dropdown-item>
            <b-dropdown-item v-else v-for="(item , index) in props.config" :key="index" @click="addItem(item)">{{_get(item, 'label', '')}}</b-dropdown-item>
        </b-dropdown>
    </div>
</template>
  
<style scoped>
/* Ẩn mũi tên xuống */
.custom-toggle::after {
    content: none;
}
</style>
  