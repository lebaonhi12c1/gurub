<script>
import _isEmpty from 'lodash/isEmpty'
import {getFirstLetter} from '../../../helpers/utils'
export default {
    props: {
        size: {
            type: String,
            default: 'sm'
        },
        src: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        bg: {
            type: String,
            default: 'primary'
        },
        thumbnail: {
            type : Boolean,
            default: false
        }
    },
    setup () {
        

        return {}
    },

    methods: {
        _isEmpty(item) {
            return _isEmpty(item)
        },
        _getFirstLetter(name) {
            if(this._isEmpty(name)) return ''
            return getFirstLetter(name)
        }
    }
}
</script>

<template>
    <div>
        <b-img alt="avatar-image" 
            class="rounded-circle"
            v-b-tooltip.hover="{title: name}"
            v-if="!_isEmpty(src)"
            :src="src"
            :class="{
                'avatar-xxs': size === 'xxs',
                'avatar-xs': size === 'xs',
                'avatar-sm': size === 'sm',
                'avatar-md': size === 'md',
                'avatar-lg': size === 'lg',
                'avatar-xl': size === 'xl',
                'avatar-xxl': size === 'xxl',
                'img-thumbnail':  thumbnail,
            }"
        >
        </b-img>
        <div alt="avatar-image" 
            class="rounded-circle d-flex align-items-center justify-content-center"
            v-b-tooltip.hover="{title: name || 'Không có tên'}"
            v-if="_isEmpty(src)"
            :src="src"
            :class="{
                'avatar-xxs': size === 'xxs',
                'avatar-xs fs-5': size === 'xs',
                'avatar-sm fs-5': size === 'sm',
                'avatar-md fs-4': size === 'md',
                'avatar-lg fs-3': size === 'lg',
                'avatar-xl fs-2': size === 'xl',
                'avatar-xxl fs-1': size === 'xxl',
                'bg-light': bg === 'light',
                'bg-primary text-white': bg === 'primary',
                'bg-danger text-white': bg === 'danger',
                'bg-warning text-white': bg === 'warning',
                'bg-success text-white': bg === 'success',
                'img-thumbnail':  thumbnail,
            }"
        >
            {{ _getFirstLetter(name) }}
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>