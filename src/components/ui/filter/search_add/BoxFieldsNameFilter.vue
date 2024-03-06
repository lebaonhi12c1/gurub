<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import { convertToLowerCase } from '../../../../helpers/utils';
const props = defineProps(
    [
        'config',
        'is_open',
        'data'
    ]
)
const emits = defineEmits(
    [
        'handleAdd',
        'handleClose'
    ]
)
const config_icon =
{
    'date': 'bx bx-time',
    'number': 'bx bx-bitcoin',
    'select': 'bx bx-select-multiple',
    'text': 'bx bx-text',
}
const search = ref('')
// const select_index = ref(null)
const getIsShow = value => {
    if (_isEmpty(search.value)) {
        return true
    }
    return convertToLowerCase(value).includes(convertToLowerCase(search.value))
}
const getIsAlreadyExist = name => {
    return _get(props, 'data').find(
        item => item.name == name
    )
}
// _get(operators, _get( value, 'type') )
const handleAddFilter2 = value => {
    emits('handleAdd', value)
    emits('handleClose')
}

const noResult = () => {
    const result = _get(props, 'config').find(item => getIsShow(item.label))
    if (_isEmpty(result)) {
        return true
    }
    return false
}
</script>
<template>
    <b-dropdown size="sm" style="width: fit-content;" variant="info" :visible="true">
        <template #button-content>
            <div class="d-flex align-items-center gap-1">
                <i class='bx bx-plus'></i>
                <span>Thêm tiêu chí</span>
            </div>
        </template>
        <div class="p-2">
            <input type="text" class="w-100 form-control p-1" placeholder="Tiêu chí" v-model="search">
            <b-dropdown-item v-for="(item, index) in config" :key="index" :class="{
                'd-none': !getIsShow(_get(item, 'label')) || getIsAlreadyExist(_get(item, 'name')),
            }
                " @click="handleAddFilter2(item)">
                <div class="d-flex align-items-center gap-2">
                    <i :class="_get(config_icon, _get(item, 'type'))">
                    </i>
                    <div>
                        {{ _get(item, 'label') }}
                    </div>
                </div>
            </b-dropdown-item>
            <div v-if="noResult() && !_isEmpty(search)"
                class="text-danger mt-2 text-center italic"
            >
                Không tìm thấy
            </div>
        </div>
    </b-dropdown>
    <div class="position-absolute top-100 text-dark start-0 rounded shadow bg-white py-4" style="z-index: 70;"
        v-if="is_open" @click.stop>
        <div class=" text-start position-relative">
            <div class="d-flex align-items-center gap-1 item bg-white px-2 py-1" style="white-space: nowrap;"
                v-for="(item, index) in config" :key="index" :class="{
                        'd-none': !getIsShow(_get(item, 'label')) || getIsAlreadyExist(_get(item, 'name')),
                    }
                    " @click="handleAddFilter2(item)">
                <i :class="_get(config_icon, _get(item, 'type'))">
                </i>
                <div>
                    {{ _get(item, 'label') }}
                </div>
            </div>`
        </div>
    </div>
</template>
<style lang="scss" scoped>
.item:hover {
    background-color: blue;
    color: red;
}
</style>
                
