

<script>
    export default {
        props: {
            view_route: {
                type: String,
                default:'#',
            },
            update_route: {
                type: String,
                default: '#'
            },
        },

        methods: {
            handleDelete() {
                this.$emit('handleDelete')
            }
        }
    }
</script>

<template>
    <ul class="list-inline hstack gap-2 mb-0 d-flex justify-content-center">
        <li class="list-inline-item" v-b-tooltip.hover="{title: 'Xem chi tiết'}">
          <router-link :to="view_route" class="text-primary d-inline-block">
            <i class="ri-eye-fill fs-16"></i>
          </router-link>
        </li>
        <li class="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover"
          data-bs-placement="top" v-b-tooltip.hover="{title: 'Sửa'}">
          <!-- <b-link variant="text-primary" class="d-inline-block edit-item-btn" @click="editdata(data)">
            <i class="ri-pencil-fill fs-16"></i>
          </b-link> -->
          <router-link variant="text-primary" class="d-inline-block edit-item-btn"
                :to="update_route"
          >
            <i class="ri-pencil-fill fs-16"></i>
          </router-link>
        </li>
        <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
          data-bs-placement="top" v-b-tooltip.hover="{title: 'Xóa'}">
          <b-link class="text-danger d-inline-block remove-item-btn" @click="handleDelete">
            <i class="ri-delete-bin-5-fill fs-16"></i>
          </b-link>
        </li>
      </ul>
</template>


<style lang="scss" scoped>

</style>