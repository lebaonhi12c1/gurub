
<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import _get from 'lodash/get';
import operators from '../../../../config/filter/operator';
import selectValue from '../../../../config/filter/select-value';
import _head from 'lodash/head';
import flatPickr from "vue-flatpickr-component";
import { convertDateToTimestamp } from '../../../../helpers/utils';
const props = defineProps(
    [
        'config',
        'data',
        'index'
    ]
)
const emits = defineEmits(
    [
        'removeItem',
        'handleUpdateItemFilter'
    ]
)

const selected = ref(_head(_get(props, 'config.search')))
const operator = ref(_head(_get(operators, _get(_head(_get(props, 'config.search')), 'type'))))
const value_field = ref('')
const handleChange = () =>
{
    emits('handleUpdateItemFilter',
    {
       
        index: props.index,
        value:
        {
            name: _get(selected.value, 'name'),
            operator: _get(operator.value, 'operator'),
            value: _get(value_field.value, 'label') ? _get(value_field.value, 'value') :  value_field.value
        }
    })
}

const handleChangeName = value =>
{
    selected.value = value
    operator.value = _head(_get(operators, _get(value, 'type')))
    value_field.value = ''
    handleChange()
}

const handleChangeOperator = value =>
{
    operator.value = value
    handleChange()
}

const handleChangeValue = value =>
{ 
    value_field.value = value
    handleChange()
}

const handleRemove = () =>
{
    emits('removeItem', props.index)
    selected.value = _head(_get(props, 'config.search'))
}
const getLabel = (key, list ) => {
    return list.find(item => item.name  == key).label
}
// value: chủ đề thay đổi thì clear lại mặt định không thì lấy phần tử đầu tiên của nó
</script>

<template>
    <div
        class="box"
    >
        <div class="item">

            <b-button-group
                class="w-100"
            >
                <b-dropdown variant="light" id="defaultDropdown" size="sm" class="w-100 text-size"
                    :text="getLabel(data.name, config.search)"
                >
                    <b-dropdown-item
                        v-for="(item, index) in _get(props, 'config.search')"
                        :key="index"
                        @click="handleChangeName(item)"
                    >
                        {{ _get(item, 'label') }}   
                    </b-dropdown-item>
                </b-dropdown>
            </b-button-group>
        </div>
        <div class="item" >
            <b-button-group
                class="w-100"
            >
                <b-dropdown variant="light" id="defaultDropdown" size="sm" class="w-100"
                    :text="_get(operator, 'name')"
                >
                    <b-dropdown-item
                        v-for="(item, index) in _get(operators, _get(selected, 'type'))"
                        :key="index"
                        @click="handleChangeOperator(item)"
                    >
                        {{ _get(item, 'name') }}
                    </b-dropdown-item>
                </b-dropdown>
            </b-button-group>
        </div>
        <div class="item" >
            <input
                class="p-1 form-control"
                style="
                    height: 28.45px;
                    font-size: 12.25px;
                "
                placeholder="Nhập giá trị..."
                v-if="_get(selected, 'type') !== 'select' && _get(selected, 'type') !== 'date'"
                :type="_get(selected, 'type')"
                v-model="value_field"
                @input="e => handleChangeValue(e.target.value)"
            />
            <flat-pickr 
                class="py-0 form-control" 
                style="
                    height: 28.45px;
                    font-size: 12.25px;
                "
                placeholder="Chọn ngày"
                v-if="_get(selected, 'type') === 'date'"
                @input="e => handleChangeValue(convertDateToTimestamp(e.target.value))"
            >

            </flat-pickr>
            <b-button-group
                class="w-100"
                v-if="_get(selected, 'type') === 'select'"
            >
                <b-dropdown id="defaultDropdown" size="sm" class="w-100 text-size"
                    :text="_get(value_field, 'label') || 'Chọn giá trị'"
                >
                    <b-dropdown-item
                        v-for="(item, index) in _get(selectValue,`${config.host}.${ _get(selected, 'name')}`)"
                        :key="index"
                        @click="handleChangeValue(item)"
                    >
                        {{ _get(item, 'label') }}
                    </b-dropdown-item>
                </b-dropdown>
            </b-button-group>
        </div>
        <div style="margin-left: auto;"
            class="d-flex align-items-center w-100  justify-content-center" 
        >
            <b-button
                class="w-100"
                type="button"
                variant="danger"
                size="sm"
                @click="handleRemove"
            >
                <i class='bx bx-trash'></i>
            </b-button>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    .box{
        width: 600px;
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(10, minmax(0, 1fr));
        .item{
            grid-column: span 3 / span 3;
        }
    }

</style>
