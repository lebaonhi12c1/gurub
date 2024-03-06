
<script setup>
import { defineProps, ref, watch, defineEmits } from 'vue';
import _get from 'lodash/get'
import _head from 'lodash/head'
import operators from '../../../../config/filter/operator';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import qDropdown from '../../q-dropdown.vue';
const props = defineProps(
    [
        'config',
        'config_host',
        'ShowDownBoxMenu'
    ]
)
const emits = defineEmits(
    [
        'handleUpdate',
        'handleRemove',
        'submit'
    ]
)
const operator = ref(_head(_get(operators, _get(_get( props, 'config' ), 'type' ))))
const value = ref('')
const rules = {
    value: { 
        required: helpers.withMessage('Vui lòng nhập giá trị', required)
    }
};

const v$ = useVuelidate(rules, { value });
const isEnter = ref(false)
const submit = (event = false) => {
    isEnter.value = event 
    if(isEnter.value)
    {
        isShowDropdown.value = false
        emits('submit')
    }
}
watch(
    [ operator, value ],
    () =>
    {
        isEnter.value = false 
        
        emits(
            'handleUpdate',
            {
                type: _get( props, 'config.type'),
                name: _get( props, 'config.name' ),
                operator: _get(operator.value, 'operator') || _get(_head(_get(operators, _get(_get( props, 'config' ), 'type' ))), 'operator'),
                value: value.value
            }
        )
        
    }
)


const getLabel = (key, list ) => {
    return list.find(item => item.name  == key)
}

const handleRemove = () =>{
    emits( 'handleRemove', _get( props.config, 'name' ))
    if(isEnter.value)
    {
        submit(true)
    }
}


const isShowDropdown = ref(true)


</script>

<template>
    <qDropdown size="sm" variant="primary" :ShowDownBoxMenuDefalt="isShowDropdown">
        <template #text>
            <div
                class="px-2 d-flex align-items-center gap-1"
            >
                {{ getLabel(config.name, config_host.search).label }} : {{ _get(operator, 'name', _get(_head(_get(operators, _get(_get( props, 'config' ), 'type' ))), 'name') ) }} 
                <span>{{  value }}</span>
            </div>
        </template> 
        <template #qDropdownItem>
            <div
                class="p-2 rounded d-flex flex-column gap-2 w-100"
                style="z-index:  60;"
            >
            <div class="d-flex align-items-center gap-2">
                    <BFormSelect v-model="operator" :options="_get(operators, _get(config, 'type')).map(item => ({ value: item, text: _get(item, 'name') }))"  size="sm"
                    />
                    <b-button
                        variant="danger"
                        size="sm"
                        style="width: fit-content;"
                        @click="handleRemove"
                    >
                        <i class='bx bx-trash-alt'></i>
                    </b-button>
            </div>
                <input type="text"
                    class="form-control text-size-sub fs-12 p-1"
                    placeholder="Nhập giá trị..."
                    size="sm"
                    v-model="value"
                    :class="{
                        'is-invalid': v$.value.$errors.length > 0
                    }"
                    @input="v$.value.$touch"
                    @keydown.enter="submit(isEnter=true)"
                >
                <div class="invalid-feedback"
                    v-for="(item, index) in v$.value.$errors" :key="index"
                >
                    {{ item.$message }}
                </div>
            </div>
        </template>
    </qDropdown>
  

</template>

<style lang="scss" scoped>

</style>