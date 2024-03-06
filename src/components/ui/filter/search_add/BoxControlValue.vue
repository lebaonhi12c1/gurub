<script setup>
import { defineProps, ref, watch, defineEmits } from 'vue';
import BoxDate from './BoxDate.vue';
import BoxSearch from './BoxSearch.vue';
import BoxSelect from './BoxSelect.vue';
import _get from 'lodash/get'
import labelField from '../../../../config/filter/label';
import { convertDateToTimestamp } from '../../../../helpers/utils';
import moment from 'moment';
const props = defineProps(
    [
        'config'
    ]
)

const emits = defineEmits(
    [
        'handleUpdate',
        'handleRemove'
    ]
)

const is_open = ref(true)
const data = ref( null )
const Components = 
{
    'date': BoxDate,
    'select': BoxSelect,
    'number': BoxSearch,
    'text': BoxSearch,
}

const handleUpdate = value =>
{
    data.value = value
}



const getBeginOrEndDay = (item) =>
{
    if( _get(item, 'operator.operator')  === '<')
    {
        return convertDateToTimestamp(moment(item.value).startOf('day').toDate());
    }
    if( _get(item, 'operator.operator')  === '>')
    {
        return convertDateToTimestamp(moment(item.value).endOf('day').toDate());
    }

    return [
        convertDateToTimestamp(moment(item.value).startOf('day').toDate())
        ,
        convertDateToTimestamp(moment(item.value).endOf('day').toDate())
    ]

}



const getConvertData = () =>
{
    if( _get(data, 'value.type') == 'date' )
    {
        return {
            ...data.value,
            value: getBeginOrEndDay( data.value ),
            operator: _get( data, 'value.operator.operator' )
        }                                                                                       
    }
    return {
        ...data.value,
        operator: _get( data, 'value.operator.operator' ),
        value: _get( data, 'value.value.value' )
    }
}

// document.addEventListener(
//     'click',
//     () =>
//     {
//         is_open.value = false
//     }
// )

watch(
    [ data ],
    () =>
    {
        emits(
            'handleUpdate',
            getConvertData()
         )
    }
)

</script>

<template>
    <div
        class=" position-relative"
    >
       <div
            class="bg-soft-info rounded-pill px-1 text-info cursor-pointer"
            @click="is_open=!is_open"
       >
            {{ _get( _get(labelField, _get( config, 'name')), 'text') }} : {{ _get(data, 'operator.name') }} {{  _get(data, 'value.label') }}
       </div>
       <div
            class="position-absolute top-100 start=0 card p-2"
            style="z-index: 60; width: 160px;"
            :class="
                {
                    'd-none': !is_open
                }
            "       
       >
            <div
                class="text-danger cursor-pointer ms-auto"
                style="width: fit-content;"
                @click="emits( 'handleRemove', _get(config, 'name') )"
            >
                remove
            </div>
            <component
                :is="_get( Components, _get( config, 'type' ))"
                :config="config"
                @handleUpdate="handleUpdate"
            >
            </component>
       </div>
    </div>
</template>
`
<style lang="scss" scoped>

</style>