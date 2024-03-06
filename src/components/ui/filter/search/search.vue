<script setup>
import _get from 'lodash/get'
import { defineProps, defineEmits, ref, watch } from 'vue';
import SearchItem from './searchItem.vue';
import _head from 'lodash/head'
import operators from '../../../../config/filter/operator';
const props = defineProps(['config', 'filters'])
const emits = defineEmits(
    [
        'handleSearch'
    ]
)
const filters = ref([])
function removeDuplicates(arr) {
    const uniqueValues = {};

    for (let i = 0; i < arr.length; i++) {
        const { name, operator, value } = arr[i];
        uniqueValues[name] = { name, operator, value };
    }

    return Object.values(uniqueValues);
}
const handleAddFilter = () =>
{
    filters.value.push(
        {
            name: _get(_head(_get(props, 'config.search')), 'name'),
            operator: _get(_head(_get(operators,_get(_head(_get(props, 'config.search')), 'type'))),'operator') ,
            value: ''
        }
    )
    emits('handleSearch',  removeDuplicates(filters.value))
}
const handleRemoveItemFilter = value =>
{
    filters.value = filters.value.filter((item, index) =>
    {
        return index!== value
    })
    emits('handleSearch',  removeDuplicates(filters.value))
}   


const handleUpdateItemFilter = value =>
{
    filters.value[value.index] = value.value 
    emits('handleSearch',  removeDuplicates(filters.value))
}

watch(()=>props.filters, ()=>{
    if(_get(props.filters, 'length', 0) == 0)
    {
        filters.value = []
    }
})

</script>


<template>
    <div>
        <b-dropdown
            size="sm"
            variant="secondary"
            auto-close="outside"
        >
            <template #button-content>
                <div
                    class="d-flex align-items-center justify-content-center gap-1"
                >
                    <i class='bx bx-filter'></i>
                    <span class="me-1 italic" v-if="filters.length == 0">
                        Lọc
                    </span>
                    <span class="me-1 italic" v-else>
                        {{filters.length}} tiêu chí lọc
                    </span>
                </div>
            </template>
            <div
                class="p-2 d-flex flex-column gap-2"
            >
                <div
                    class=" italic text-muted text-nowrap"
                >
                    Tiến hành tìm kiếm dữ liệu mà bạn muốn bằng cách thêm tiêu chí
                </div>
                <SearchItem
                    v-for="(item, index) in filters" 
                    :key="index"
                    :index="index"
                    :data="item"
                    :config="_get(props, 'config')"
                    @handleUpdateItemFilter="handleUpdateItemFilter"
                    @removeItem="handleRemoveItemFilter"
                />
                <b-button
                    style="width:fit-content;"
                    variant="primary"
                    size="sm"
                    @click="handleAddFilter"
                >
                    Thêm
                </b-button>
            </div>
        </b-dropdown>
    </div>
</template>

<style lang="scss" scoped>

</style>