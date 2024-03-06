<script>
    import CardListItem from './card-list-item.vue';
    import _get from 'lodash/get'
    import NoResultTable from "../../../components/ui/noresult-table.vue";
    export default {
        props: {
            class_custom_sub: {
                type: String,
                default: ''
            },
            data: {
                type: Array,
                default: () => [],
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: '',
            },
            link_to_all: {
                type: String,
                default: ''
            },
            none_link: {
                type: Boolean,
                default: false
            },
            size_item: {
                type: String,
                default: 'sm'
            },
            max_height: {
                type: String,
                default: '100%'
            },
            is_custom_list_item: {
                type: Boolean,
                default: false
            }
        },
        
        components: {
            CardListItem,
            NoResultTable
        },

        methods: {
            _get(item, ref, auto = null) {
                return _get(item, ref, auto)
            },
        }
    }
</script>


<template>
    <b-card no-body>
        <b-card-header class="d-flex align-items-center">
            <h6 class="card-title mb-0 flex-grow-1">
                {{ title }}
            </h6>
            <router-link class="link-info"
                v-if="!none_link"
                :to="link_to_all" 
            >
                Tất cả <i class="ri-arrow-right-line align-bottom"></i>
            </router-link>
        </b-card-header>
        <b-card-body>
            <div class="table-responsive table-card">
                <div data-simplebar
                    :style="{ 'max-height': max_height }"
                >
                    <div class="p-2">
                        <div v-if="isLoading" class="rounded placeholder placeholder-glow w-100" style="min-height: 100px" ></div>
                    </div>
                    <div v-if="_get(data, 'length',0) == 0 && isLoading == false">
                        <NoResultTable size="md"></NoResultTable>
                    </div>
                    <ul class="list-group list-group-flush" v-else>
                        <slot name="slot_list_item" v-if="is_custom_list_item"/>
                        <li class="list-group-item list-group-item-action"
                            v-for="(item, index) in data" :key="index"
                            v-else
                        >
                            <CardListItem :data="item" :isLoading="isLoading" :size="size_item" :class_custom_sub="class_custom_sub"/>
                        </li>
                    </ul>
                </div>
            </div>
        </b-card-body>
    </b-card>
</template>

<style lang="scss" scoped>

</style>