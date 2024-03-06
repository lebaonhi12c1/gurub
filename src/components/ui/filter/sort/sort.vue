
<script setup>

import _get from 'lodash/get'
import _filter from 'lodash/filter'
import _map from 'lodash/map'
import { defineProps, defineEmits, ref, watch } from 'vue';
import SortItem from "./sortItem.vue"
import btnAddSort from './btnAddSort.vue';
const props = defineProps(['config','config_host', 'orders'])
const emits = defineEmits(['handleSort'])



const arraySortItem = ref([])

const addArraySortItem = (value) => 
{
       arraySortItem.value.push({
        name: _get( value , 'name'),
        value: 'asc'
    })

    emits('handleSort', (arraySortItem.value))

}

const handleRemoveSortItem = (index) => 
{
    arraySortItem.value = arraySortItem.value.filter((item, i) => i !== index);
    emits('handleSort', (arraySortItem.value))

};


const handleEditSortItem = (value) =>
{
    const sortItem = arraySortItem.value[value.index]
    sortItem[value.key] = value.value
    arraySortItem.value.splice(value.index, 1, sortItem)
    emits('handleSort', (arraySortItem.value))
}



function findNonIntersectingObjects(arr1, arr2) {
  const namesSet1 = new Set(_map(arr1, 'name'));
  const namesSet2 = new Set(_map(arr2, 'name'));

  const nonIntersectingObjects = _filter(arr1, item => !namesSet2.has(item.name))
    .concat(_filter(arr2, item => !namesSet1.has(item.name)));

  return nonIntersectingObjects || []
}

watch(()=>props.orders, ()=>{
    if(_get(props.orders, 'length', 0) == 0)
    {
        arraySortItem.value = []
    }
})
</script>


<template>
    <div class="flex flex-col gap-2">
        <b-dropdown variant="secondary" size="sm"
            auto-close="outside"
        >
            <template #button-content>
                <div
                    class="d-flex align-items-center gap-1"
                >
                    <i class='bx bx-sort' ></i>
                    <span class="italic" v-if="arraySortItem.length == 0">Sắp xếp</span>
                    <span class="italic" v-else>{{arraySortItem.length}} tiêu chí sắp xếp</span>
                </div>
            </template>
            <div
                class="italic px-2 mb-2 text-muted"
            >
                Tiến hành sắp xếp bằng cách thêm tiêu chí
            </div>
            <div class="gap-2 d-flex flex-column  mb-2">
                <SortItem  
                    v-for="(item, index) in arraySortItem" :key="index" 
                    :config="findNonIntersectingObjects(config, arraySortItem)" 
                    :item="item"
                    :config_host="config_host"
                    :position="index"
                    @handleRemoveSortItem="handleRemoveSortItem" 
                    @handleEditSortItem="handleEditSortItem" >
                </SortItem>
            </div>
            <btnAddSort 
                :config="findNonIntersectingObjects(config, arraySortItem)" 
                @addArraySortItem="addArraySortItem"
            ></btnAddSort>
            
        </b-dropdown>
    </div>
</template>