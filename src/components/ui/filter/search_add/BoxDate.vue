
<script setup>
import { defineProps, ref, watch, defineEmits, onMounted } from 'vue';
import _get from 'lodash/get'
import _head from 'lodash/head'
import operators from '../../../../config/filter/operator';
import { convertDateToTimestamp } from '../../../../helpers/utils';
import moment from 'moment';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import qDropdownVue from '../../q-dropdown.vue';

const props = defineProps(
    [
        'config',
        'config_host'
    ]
)
const emits = defineEmits(
    [
        'handleUpdate',
        'handleRemove',
        'submit',
    ]
)
const operator = ref(_head(_get(operators, _get(_get(props, 'config'), 'type'))))
const value = ref('')


const rules = {
    value: { 
        required: helpers.withMessage('Vui lòng chọn ngày', required),
    }
};

const v$ = useVuelidate(rules, { value });

const submit = () => {
    emits('submit')
}

const getBeginOrEndDay = () => {
    if (_get(operator.value, 'operator') === '<' || operator.value === null) {
        return convertDateToTimestamp(moment(value.value).startOf('day').toDate());
    }
    if (_get(operator.value, 'operator') === '>') {
        return convertDateToTimestamp(moment(value.value).endOf('day').toDate());
    }

    return [
        convertDateToTimestamp(moment(value.value).startOf('day').toDate())
        ,
        convertDateToTimestamp(moment(value.value).endOf('day').toDate())
    ]

}
watch(
    [operator, value],
    () => {
        emits(
            'handleUpdate',
            {
                type: _get(props, 'config.type'),
                name: _get(props, 'config.name'),
                operator: _get(operator.value, 'operator') || _get(_head(_get(operators, _get(_get(props, 'config'), 'type'))), 'operator'),
                value: getBeginOrEndDay(),
            }
        )
    }
)

const getLabel = (key, list ) => {
    return list.find(item => item.name  == key)
}
const handleRemove = () =>{
    emits( 'handleRemove', _get( props.config, 'name' ))
    submit()
}
</script>


<template>
    <qDropdownVue size="sm" variant="primary" :ShowDownBoxMenu="true">
        <template #text>
            <div class="px-2 d-flex align-items-center gap-1">
                {{ getLabel(config.name, config_host.search).label }} : {{ _get(operator, 'name',
                    _get(_head(_get(operators, _get(_get(props, 'config'), 'type'))), 'name')) }}
                <span>{{ value }}</span>
            </div>
        </template>
        <template #qDropdownItem>
            <div class=" p-2 d-flex flex-column gap-2 w-100" style="z-index: 60;">
                <div class="d-flex align-items-center gap-2">
    
                    <BFormSelect v-model="operator" :options="_get(operators, _get(config, 'type')).map(item => ({ value: item, text: _get(item, 'name') }))"  size="sm"
                    />
                    <b-button variant="danger" size="sm" @click="handleRemove">
                        <i class='bx bx-trash-alt'></i>
                    </b-button>
                </div>
                    <input type="date" class="form-control p-1 fs-12" v-model="value" @change="submit"
                        :class="{'border-danger': v$.value.$errors.length > 0}"
                        @blur="v$.value.$touch"
                    />
                    <div class="text-danger fs-12"
                        v-for="(item, index) in v$.value.$errors" :key="index"
                    >
                        {{ item.$message }}
                    </div>
    
            </div>
        </template>

    </qDropdownVue>
   
</template>

<style lang="scss" scoped></style>