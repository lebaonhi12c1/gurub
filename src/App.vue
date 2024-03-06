<script>
import _get from 'lodash/get'
import Main from './layouts/main.vue';
import Auth from './layouts/auth.vue';
import None from './layouts/none.vue';
export default {
    name: 'App',
    components: {
        Main,
        Auth,
        None
    },
    setup() {
        const state = {
            layout: {
                'main': Main, 
                'auth': Auth, 
                'none': None, 
            }
        }
        return state
    },

    methods: {
        _get(item, ref, defaultVal = null) {
            return  _get(item, ref, defaultVal)
        }
    }
}
</script>

<template>
    <component :is="_get(layout,this.$route.meta.layout)">
            <router-view></router-view>
    </component>
</template>

