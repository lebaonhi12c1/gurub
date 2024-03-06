<script setup>
import _get from 'lodash/get'
import { defineProps, defineEmits, ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import Sort from './sort/sort.vue'
// import Search from './search/search.vue'
import BoxFieldsNameFilter from './search_add/BoxFieldsNameFilter.vue';
import ListFilter from './search_add/ListFilter.vue';
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
import operators from '../../../config/filter/operator'
import _head from 'lodash/head'
import { useVuelidate } from '@vuelidate/core';

const props = defineProps(['config'])
const emits = defineEmits(['handleFilter'])
const filters = ref([])
const orders = ref([])
const filters2 = ref([])


const v$ = useVuelidate()
//sorting
const handleSort = value => {
    orders.value = value
}
// const handleSearch = value => {
//     filters.value = value
// }
const handleAddFilter2 = value => {
    filters2.value.push(
        {
            host: _get(props, 'config.host'),
            type: _get(value, 'type'),
            name: _get(value, 'name'),
            operator: _get(_head(_get(operators, _get(value, 'type'))), 'operator'),
            value: ''
        }
    )
}
const handleUpdate = value => {
    if (_isEmpty(_find(filters2.value, { name: _get(value, 'name') }))) {
        filters2.value.push(value)
        return
    } filters2.value = filters2.value.map(
        item => item.name == value.name ? value : item
    )
}
const handleRemove = name => {
    filters2.value = filters2.value.filter(
        item => item.name != name
    )
}
const convertFIlter = (list = []) => {
    return list.map(item => {
        return {
                name: _get(item, 'name'),
                operator: _get(item, 'operator'),
                value: _get(item, 'value')
        }
    })
}

const isCallApi = ref(false)
const isChangeValue = ref(false)
const isClickClearFilter = ref(false)
const isCLickSubmit = ref(false);
const submitButtonRef = ref(null);

const handleRemoveFilter = () => {
   


    filters2.value = []
    orders.value = []
    filters.value = []


    if (isCallApi.value)
    {
        isCallApi.value = true
        emits('handleFilter', {
            filters: [],
            orders,
            callApi: true

        })
        return
    }
    
}

const submit = () => {
    
    v$.value.$validate()
    if(v$.value.$invalid) 
    {
        return   
    }

    isChangeValue.value = false
    isCallApi.value = true

    emits('handleFilter',
        {
            filters: [ ...convertFIlter(filters2.value)],
            orders,
            callApi: true
        }
    )

    
}

const handleDisabledBtnSubmit = ()=>{
    if(isClickClearFilter.value)
    {
        return true
    }
    if (isCallApi.value)
    {
        if(isChangeValue.value)
        {
            if(filters2.value.length == 0 && orders.value.length == 0)
            {

                return false
            }
            return false
        }
        return true
    }
    else
    {
        if(filters2.value.length == 0 && orders.value.length == 0)
        {

            return true
        }
        return false
    }
}

const handleDisabledBtnClear = ()=>{
    if(filters2.value.length == 0 && orders.value.length == 0)
    {
        isClickClearFilter.value = true
        return true
    }

}


watch(()=>filters2.value, ()=>{
    isChangeValue.value = true
    isClickClearFilter.value = false
}, {deep: true})

watch(()=>orders.value, ()=>{
    isChangeValue.value = true
    isClickClearFilter.value = false
}, {deep: true})


const handleClickOutside = (event) => {
    if(_get(event, 'pointerType') =='')
    {
        return
    }
    isCLickSubmit.value = false;


}

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
})

</script>
<template>
    <b-form @submit.prevent="submit" ref="container">
        <div class="d-flex gap-2 flex-wrap">
            <Sort v-if="_get(props, 'config.sort')" :config="_get(props, 'config.sort')" :config_host="_get(props, 'config')"
                @handleSort="handleSort" :orders="orders" />
            <!-- <Search v-if="_get(props, 'config.search')" :config="_get(props, 'config')" :filters="filters"
                @handleSearch="handleSearch" /> -->
            <div class="d-flex align-items-center gap-2 flex-wrap" v-if="filters2.length > 0">
                <ListFilter :config="_get(props, 'config')" :data="filters2" @handleUpdate="handleUpdate"
                    :isCLickSubmit="isCLickSubmit"
                    @handleRemove="handleRemove" @submit="submit" />
            </div>
         
            <BoxFieldsNameFilter :config="_get(config, 'search')" :data="filters2" @handleAdd="handleAddFilter2" />
            <b-button size="sm" variant="danger" @click="handleRemoveFilter" :disabled="handleDisabledBtnClear()">
                <div class="d-flex align-items-center gap-1">
                    <i class="ri-equalizer-fill me-1 align-bottom"></i>
                    <span>Xóa bộ lọc</span>
                </div>
            </b-button>
            <b-button size="sm" type="submit" @click='isCLickSubmit= true' variant="success" :disabled="handleDisabledBtnSubmit()">
                <div class="d-flex align-items-center gap-1">
                    <i class='bx bx-search'></i>
                    <span>
                        Tìm kiếm
                    </span>
                </div>
            </b-button>
           
        </div>
    </b-form>
</template>
<style lang="scss" scoped></style>
