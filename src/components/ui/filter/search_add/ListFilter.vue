<script setup>
import { defineProps, defineEmits } from 'vue';
import _get from 'lodash/get'
import BoxDate from './BoxDate.vue';
import BoxSearch from './BoxSearch.vue';
import BoxSelect from './BoxSelect.vue';
import BoxNumber from './BoxNumber.vue';
const props = defineProps(
    [
        'data',
        'config',
        "isCLickSubmit",
    ]
)
const emits = defineEmits(
    [
        'handleUpdate',
        'handleRemove',
        'submit',
    ] 
)

const handleUpdate = value =>
{
    emits(
        'handleUpdate',
        value
    )
}

const handleRemove = name =>
{
    emits(
        'handleRemove',
        name
    )
}

const submit = () =>{
    emits(
        'submit'
    )
}

const Components = 
{
    'date': BoxDate,
    'select': BoxSelect,
    'number': BoxNumber,
    'text': BoxSearch,
}


</script>

<template>

    <div
        v-for="(item, index) in props.data" 
        :key="index"
    >
        <component
            :is="_get( Components, _get( item, 'type' ))"
            :config="item"
            :index="index"
            :config_host="props.config"
            :isCLickSubmit="isCLickSubmit"
            @handleUpdate="handleUpdate"
            @handleRemove="handleRemove"
            @submit="submit"
        >
        </component>
    </div>
</template>

<style lang="scss" scoped>

</style>