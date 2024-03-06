
<script setup>
import { defineProps, ref, watch, defineEmits } from 'vue';
import _get from 'lodash/get'
import _head from 'lodash/head'
import _isEmpty from 'lodash/isEmpty'
import operators from '../../../../config/filter/operator';
import select_value from '../../../../config/filter/select-value';
import { convertToLowerCase } from '../../../../helpers/utils';
import courseTyp from '../../../../config/type/course-typ';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import qDropdown from '../../q-dropdown.vue';

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
        'submit'
    ]
)
const operator = ref(_head(_get(operators, _get(_get(props, 'config'), 'type'))))
const value = ref(null)
const search = ref('')


const rules = {
    value: {
        required: helpers.withMessage('Vui lòng chọn giá trị', required),
    }
};

const v$ = useVuelidate(rules, { value });

watch(
    [operator, value],
    () => {
        emits(
            'handleUpdate',
            {
                host: _get(props, 'config.host'),
                type: _get(props, 'config.type'),
                name: _get(props, 'config.name'),
                operator: _get(operator.value, 'operator') || _get(_head(_get(operators, _get(_get(props, 'config'), 'type'))), 'operator'),
                value: _get(value.value, 'value') || _get(_head(_get(select_value, `${_get(props, 'config.host')}.${_get(props, 'config.name')}`)), 'value'),
            }
        )
    }
)

watch(
    [value], () => {
        emits(
            'handleUpdate',
            {
                host: _get(props, 'config.host'),
                type: _get(props, 'config.type'),
                name: _get(props, 'config.name'),
                operator: _get(operator.value, 'operator') || _get(_head(_get(operators, _get(_get(props, 'config'), 'type'))), 'operator'),
                value: _get(value.value, 'value') || _get(_head(_get(select_value, `${_get(props, 'config.host')}.${_get(props, 'config.name')}`)), 'value'),
            }
        )
        emits('submit')
    }
)

const getIsShow = label => {
    if (_isEmpty(search.value)) {
        return true
    }
    return convertToLowerCase(label).includes(convertToLowerCase(search.value))
}

const getLabel = (key, list) => {
    return list.find(item => item.name == key)
}
// _get(_head(_get(select_value, `${_get(props, 'config.host')}.${_get(props, 'config.name')}`)), 'label')

const noResult = () => {


    const result = _get(select_value, `${_get(props, 'config.host')}.${_get(props, 'config.name')}`).find(item => getIsShow(item.label))
    if (_isEmpty(result)) {
        return true
    }
    return false
}

const handleRemove = () => {
    emits('handleRemove', _get(props.config, 'name'))
    emits('submit')
}

</script>

<template>
    <qDropdown size="sm" variant="primary" :ShowDownBoxMenu="true">
        <template #text>
            <div class="px-2 d-flex align-items-center gap-1">
                {{ getLabel(config.name, config_host.search).label }} : {{ _get(operator, 'name',
                    _get(_head(_get(operators, _get(_get(props, 'config'), 'type'))), 'name')) }}
                <span>
                    {{ _get(value, 'label', 'Chưa có giá trị') }}
                </span>
            </div>


        </template>
        <template #qDropdownItem>

            <div class="p-2 rounded d-flex flex-column gap-2 w-100" style="z-index: 60;">
                <div class="d-flex align-items-center gap-2 w-full">
                    <BFormSelect v-model="operator" :options="_get(operators, _get(config, 'type')).map(item => ({ value: item, text: _get(item, 'name') }))"  size="sm"
                    />
                    <b-button variant="danger" size="sm" @click="handleRemove">
                        <i class='bx bx-trash-alt'></i>
                    </b-button>
                </div>
                <b-dropdown size="sm" :variant="v$.value.$errors.length > 0 ? 'danger' : 'secondary'">
                    <template #button-content>
                        <div class="text-start d-flex align-items-center gap-1 px-2 ">
                            {{ _get(value, 'label', 'Chọn giá trị') }}
                        </div>
                    </template>
                    <div class="p-2">
                        <input type="text" class="form-control p-1 mb-2" placeholder="Nhập..." v-model="search">
                        <b-dropdown-item
                            v-for="(item, index) in _get(select_value, `${_get(config, 'host')}.${_get(config, 'name')}`)"
                            :key="index" :class="{
                                'd-none': !getIsShow(_get(item, 'label'))
                            }" 
                            @click="value = item"
                        >
                            <i :class="_get(courseTyp, _get(item, 'value') + '.icon')"></i>
                            {{ _get(item, 'label') }}
                        </b-dropdown-item>
                        <div v-if="noResult() && !_isEmpty(search)" class="text-danger mt-2 text-center italic">
                            Không tìm thấy
                        </div>
                    </div>
                </b-dropdown>
                <div class="text-danger fs-12" v-for="(item, index) in v$.value.$errors" :key="index">
                    {{ item.$message }}
                </div>
            </div>
        </template>
    </qDropdown>
</template>

<style lang="scss" scoped></style>