
<script>
import fadeContainer from '../../../../ui/fade-container.vue'
export default {
    components: { fadeContainer },
    props: {
        course_type: {
            type: String,
            default: 'single'
        }
    },
    methods: {
        onSubmit() {
            this.$emit('nextStep',1)
        }
    },

    computed: {
        course_type_selected: {
            get() {
                return this.course_type;
            },
            set(value) {
                this.$emit("update:course_type", value);
            },
        }
    }
}
</script>

<template>
    <fade-container>
        <div class="tab-pane fade show active" id="pills-bill-info" role="tabpanel" aria-labelledby="pills-bill-info-tab">
            <div>
                <h5 class="mb-1">Phân loại khóa học</h5>
                <p class="text-muted mb-4">
                    Chọn loại khóa học học để chuyển sang bước tiếp theo
                </p>
            </div>
    
            <b-form @submit="onSubmit">
                <b-form-group label="Loại khóa học">
                    <b-form-radio v-model="course_type_selected" name="some-radios" value="combo">Combo</b-form-radio>
                    <b-form-radio v-model="course_type_selected" name="some-radios" value="single">Cơ bản</b-form-radio>
                </b-form-group>
                <b-button variant="success" type="submit" class="btn-label right ms-auto nexttab">
                    <i class="bx bx-chevron-right label-icon align-middle fs-16 ms-2 "></i>Tiếp tục
                </b-button>
            </b-form>
        </div>
    </fade-container>
</template>


<style lang="scss" scoped></style>