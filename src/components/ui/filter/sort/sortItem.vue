<script setup>
    import { ref, defineProps, defineEmits } from "vue"
    import _get from "lodash/get"
    import isEmpty from "lodash/isEmpty"

    const emits = defineEmits(['handleRemoveSortItem', 'handleEditSortItem'])
    const props = defineProps(['config', 'position', 'item', 'config_host'])
    const order = ref('Giảm dần')
    
    const name = ref()

    const handleRemove = ()=>
    {
        emits('handleRemoveSortItem', props.position)
    }


    const onClickSelectName = (item)=>
    {
        emits('handleEditSortItem', {index: props.position, key: 'name', value: _get(item, 'name') })
        name.value = item.label
    }

    const onClickSelectOparator = (value)=>
    {
        emits('handleEditSortItem', {index: props.position, key: 'value', value: value })
        if (value == 'asc')
        {
            order.value = 'Tăng dần'
            return
        }

        order.value = 'Giảm dần'

    }

const operatorField = {
    desc: 'Giảm dần',
    asc: 'Tăng dần'
}


const getLabel = (key, list ) => {
    return list.find(item => item.name  == key)
}

</script>

<template>
    <div class="box">
        <div class="item">
            <b-button-group class="w-100">
                <b-dropdown class="w-100" size="sm" variant="light"
                    :text="getLabel(item.name, config_host.sort).label"  
                >
                    <b-dropdown-item
                        v-if="isEmpty(config)"
                    > 
                        Không còn tiêu chí nào
                    </b-dropdown-item>
                    <b-dropdown-item
                        v-else
                        v-for="(item, index) in props.config" :key="index"
                        @click="onClickSelectName(item)"
                    > 
                    {{ _get(item, 'label') }}
                    </b-dropdown-item>
                </b-dropdown>
            </b-button-group>
        </div>
        <div class="item">
            <b-button-group class="w-100">
                <b-dropdown class="w-100" size="sm" variant="light" :text="_get(operatorField, `${item.value}`)" >
                    <b-dropdown-item
                        @click="onClickSelectOparator('asc')"
                    > 
                        <div
                            class="d-flex align-items-center gap-1"
                        >
                            <i class='bx bx-sort-up'></i>
                            <span>Tăng dần</span>
                        </div>
                    </b-dropdown-item>
                    <b-dropdown-item
                        @click="onClickSelectOparator('desc')"
                    > 
                    <div
                        class="d-flex align-items-center gap-1"
                    >
                        <i class='bx bx-sort-down'></i>
                        <span>Giảm dần</span>
                    </div>
                    </b-dropdown-item>
                </b-dropdown>
            </b-button-group>
        </div>
        <b-button 
            size="sm" variant="danger"
            @click="handleRemove"
        >
            <i class="bx bx-trash"></i>
        </b-button>
    </div>
</template>


<style lang="scss" scoped>
.box{
    padding: 0 8px;
    width: 450px;
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    .item{
        grid-column: span 3 / span 3;
    }
}
</style>