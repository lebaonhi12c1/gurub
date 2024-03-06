<script>
import _get from "lodash/get"
export default {
    props: {
        size: {
            type: String,
            default: "md",
        },
        varitant: {
            type: String,
            default: "primary",
        },
        iconDown: {
            type: Boolean,
            default: true,
        },
        ShowDownBoxMenuDefalt: {
            type: Boolean,
            default: true,
        },
        ShowDownBoxMenu: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        isCLickSubmit: {
            type: Boolean,
            default: false,
        }
    },

    data(){
        return{
            isShowDownBoxMenu: true,
            isFirstLoadComponent: true,
        }
    },
    mounted() {
        this.isShowDownBoxMenu = this.ShowDownBoxMenuDefalt
        if(this.isShowDownBoxMenu)
        {
            document.addEventListener('click', this.handleClickOutside);

        }
    },
    
    beforeUnmount() {
       
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        handleEventClickToDownBoxMenu(value, event){
            this.updateDropdownPosition()
            if(_get(event, 'pointerType') =='')
            {
                return
            }
            this.isShowDownBoxMenu= value
        },
        handleClickOutside(event) {
            const buttonElement = this.$el; // Lấy phần tử của component
            if(this.isFirstLoadComponent)
            {
                this.isFirstLoadComponent = false;
                return
            }
          
            // if(!this.ShowDownBoxMenu && this.isCLickSubmit)
            // {
            //     this.isShowDownBoxMenu = true
            //     return
            // }
        

                // Kiểm tra xem sự kiện click có diễn ra bên ngoài nút button không
            
            if (!buttonElement.contains(event.target)) {
               
                if(!this.isFirstLoadComponent)
                {

                    if(_get(event, 'pointerType') =='')
                    {
                        return
                    }

                    this.isShowDownBoxMenu = false;
                }
                // Nếu không phải là nút button hoặc các phần tử con của nó, đặt isShowDownBoxMenu thành false
            }
        },
        updateDropdownPosition() {
            if(this.isShowDownBoxMenu)
            {
                const dropdownElement = this.$refs.dropdown;

                if(_get(dropdownElement, 'getBoundingClientRect' ))
                {
                    // Kiểm tra xem dropdown có tràn màn hình bên trái không
                    if (dropdownElement.getBoundingClientRect().right > window.innerWidth) {
                        // Nếu tràn bên trái, sử dụng thuộc tính 'right' thay vì 'left'
                        dropdownElement.style.left = "auto";
                        dropdownElement.style.right = "0";
                    } else {
                        // Nếu không, đảm bảo thuộc tính 'left' được sử dụng
                        dropdownElement.style.left = "0";
                        dropdownElement.style.right = "auto";
                    }
                }
            }
        },
        
            
    },

    computed: {
        layout_mode() {
            return this.$store.state.layout.mode
        },
        dropdownStyle() {
            // Kiểm tra xem dropdown có mở không và cập nhật vị trí nếu cần
            if (this.isShowDownBoxMenu) {
                this.$nextTick(this.updateDropdownPosition);
            }
            return {
                display: this.isShowDownBoxMenu ? "block" : "none",
                position: "absolute",
            };
        },
        // isCLickSubmitHandle(){
        //     return [this.isCLickSubmit, this.ShowDownBoxMenu]
        // }

       
    },
    watch: {
        'ShowDownBoxMenuDefalt'() {
            if(this.ShowDownBoxMenuDefalt){
                this.isShowDownBoxMenu = true
            }            
        },
        // isCLickSubmitHandle(){
           
                // if(!this.isCLickSubmit)
                // {
                //     if(this.ShowDownBoxMenu)
                //     {
                //         return
                //     }
                //     this.isShowDownBoxMenu = false;

                //     return
                // }

                // if(this.ShowDownBoxMenu && this.isCLickSubmit)
                // {
                //     this.isShowDownBoxMenu = true
                //     return
                // }
                // if(this.isCLickSubmit && !this.ShowDownBoxMenu)
                // {
                //     this.isShowDownBoxMenu = true
                //     return
                // }
        // }
    },

       

}
</script>

<template>
    <b-button  class="position-relative" 
        :disabled="disabled"
        :size="size" 
        :variant="varitant" @click="(event)=>handleEventClickToDownBoxMenu(!isShowDownBoxMenu, event)">
        <div class="d-flex gap-1 align-items-center"  >
            <slot name="text"></slot>
            <i class='bx bx-chevron-down fw-medium fs-15'></i>
        </div>
        <div class="position-absolute q-container-box-menu rounded py-1 d-flex flex-column justify-content-center align-items-start shadow-lg"
            :class="{'class-mode-dark': layout_mode == 'dark'}"
            data-aos="fade-in"
            data-aos-duration="600"
            data-aos-offset="100"
            data-reference="parent" data-boundary="viewport"
            @click.stop="(event) => handleEventClickToDownBoxMenu(true, event)"
            ref="dropdown"
            :style="dropdownStyle"
            v-if="isShowDownBoxMenu"
        >
            <slot name="qDropdownItem"></slot> 
        </div>

    </b-button>
</template>

<style lang="scss" scoped>
.q-container-box-menu
{
    top: 102%;
    min-width: 17rem;
    min-height: 2rem;
    color: #212529;
    background-color: #fff;
    z-index: 1004;
}

.class-mode-dark
{
    background-color: #292e33 !important;
    color: #898C9B;
}


</style>