<script>
import {
    required,
    helpers,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import get from "lodash/get"
import "swiper/swiper-bundle.css";
import TabOverview from '../../../components/page/category/category-detail/tab-overview.vue';
import PlaceholderWraper from '../../../components/ui/placeholder-wraper.vue';
import Text from '../../../components/ui/text.vue';
import CategoryService from '../../../services/category.service'
import { label_category } from "../../../config/labels/label-category";
import courseTyp from "../../../config/type/course-typ";
import ButtonHandle from "../../../components/ui/button-handle.vue"
import _isEqual from "lodash/isEqual";

import moment from "moment";
import TabMangeTopic from "../../../components/page/category/category-detail/tab-mange-topic.vue";
import CardList from "../../../components/ui/card/card-list.vue";
import CourseService from "../../../services/course.service";
import RightSidebarCreate from "../../../components/ui/modal/right-sidebar-create.vue";
import fadeContainer from "../../../components/ui/fade-container.vue";
export default {

    data() {
        return {
            get,
            moment,
            label_category,
            title: "Profile",
            isLoadingDetail: false,
            isLoadingCourses: false,
            isLoadingBtnSubmit: false,
            dataDetail: [],
            dataCourse: [],
            isOpenModalUpdate: false,
            courseTyp,
            is_disabled: true,
            form:{
                id: null,
                code: null,
                name: "",
                status: null,
                description: ""
            },
            status: [{text: 'Bản nháp', value: 'draft'}, {text: 'Xuất bản', value: 'publish'}],
            tab_session: JSON.parse(sessionStorage.getItem( 'tab-detail' )) || 'overview',
            v$: useVuelidate(),
        };
    },
    components: {
        TabOverview,
        Text,
        PlaceholderWraper,
        TabMangeTopic,
        CardList,
        RightSidebarCreate,
        ButtonHandle,
        fadeContainer
    },
    validations: {
        form: {
            name: {
                required: helpers.withMessage("Tên không được để trống", required),
            },
        }
    },

    methods: {

        async fetchData() {
            this.isLoadingDetail = true;

            this.dataDetail = await CategoryService.getCategory(this.$route.params.id, {

                pagination: {
                    page: 1,
                    limit: 50
                }
            })

            if (get(this.dataDetail, 'message', 'NOT_FOUND')=='NOT_FOUND')
            {
                this.$router.push('/not_found')
                this.isLoadingDetail = false;
                
            }
            this.isLoadingDetail = false;
        },
        
        openUpdateModal() {
            let data = get(this.dataDetail,'data',[])
            this.form = {
                id: get(data, 'id',''),
                code: get(data, 'code',''),
                name: get(data, 'name',''),
                description: get(data, 'description',''),
                status: get(data, 'status','draft')
            }
            this.isOpenModalUpdate=true;
        },

        closeUpdateModal() {
            this.isOpenModalUpdate=false;
        },
        async fetchDataCourses() {
            this.isLoadingDetail = true;
            let response =  await CourseService.getCoursesCategory(this.$route.params.id)
            
            this.dataCourse = get(response, 'data', []).map((data)=>({
                name: data.name,
                image: get(courseTyp, data.type + '.logo', ''),
                sub: moment(data.start_date * 1000).format("DD/MM/YYYY") + " - " +moment(data.end_date * 1000).format("DD/MM/YYYY"),
                route: "/courses/"+data.id
            })) 

            this.isLoadingDetail = false;

        },
        async editCategory(value) {
            this.isLoadingBtnSubmit = true
            await CategoryService.updateCategory(value, this.$route.params.id)
            await this.fetchData()
            this.isLoadingBtnSubmit = false
        },

        async onSubmit(event) {
            event.preventDefault()
            
            await this.editCategory(this.form)
            await this.fetchDataCourses()

            this.closeUpdateModal()
        },

        checkValidate(field){
            if(field == 'code')
            {
                return this.form.code ? true : false
            }

            if(field == 'name')
            {
                return this.form.code ? true : false
            }
            
        },

        async reCallAPIGetDataDetail(value){
            if(value.reCallAPIGetDataDetail)
            {
                await this.fetchData()
            }
        },

        setSessionOnClickTab(value)
        {
            this.tab_session=value
            sessionStorage.setItem('tab-detail', JSON.stringify(value))
        }
    },

    mounted() {
        this.fetchData();
        this.fetchDataCourses()
    },

    watch: {
  
        "form":{
            handler(){
                if(get(this.dataDetail,'data'))
                {
                    let dataTempToEqual = {
                        id: get(this.dataDetail,'data.id'),
                        code: get(this.dataDetail,'data.code'),
                        status: get(this.dataDetail,'data.status'),
                        name: get(this.dataDetail,'data.name'),
                        description: get(this.dataDetail,'data.description'),
                    }
                    if(_isEqual(dataTempToEqual,this.form))
                    {
                        this.is_disabled = true
                        return

                    }
                    this.is_disabled = false
                }

            },
            deep: true
        }
    }

};
</script>

<template>

    <div class="profile-foreground position-relative mx-n4 mt-n4">
        <div class="profile-wid-bg">
            <img src="@/assets/images/profile-bg.jpg" alt="" class="profile-wid-img" />
        </div>
    </div>
    <div class="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
        <b-row class="g-4">
            <b-col cols="auto">
                <div class="avatar-lg">
                    <img src="../../../assets/images/giaotrinh.png" alt="user-img" class="img-thumbnail rounded-circle" />
                </div>
            </b-col>
            <b-col>
                <div class="p-2">
                    <h3 class="text-white mb-1">
                        <placeholder-wraper :isLoading="isLoadingDetail">
                            <Text :text="get(dataDetail, 'data.name')" />
                        </placeholder-wraper>
                    </h3>
                    <p class="text-white-75">
                        <placeholder-wraper :isLoading="isLoadingDetail">
                            <Text :text="get(dataDetail, 'data.code')" />
                        </placeholder-wraper>
                    </p>

                </div>
            </b-col>
        </b-row>
    </div>

    <b-row>
        <b-col lg="12">
            <div>
                <div class="d-flex profile-wrapper">
                    <ul class="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1">
                        <li class="nav-item">
                            <b-link 
                                class="nav-link fs-14" 
                                :class="{ 'active': tab_session == 'overview' }"
                                @click="setSessionOnClickTab('overview')"
                            >
                                <i class="ri-airplay-fill d-inline-block d-md-none"></i>
                                <span class="d-none d-md-inline-block">Tổng quan</span>
                            </b-link>
                        </li>
                        <li class="nav-item">
                            <b-link 
                                class="nav-link fs-14" 
                                :class="{ 'active': tab_session == 'manageTopic' }"
                                @click="setSessionOnClickTab('manageTopic')"
                            >
                                <i class="ri-list-unordered d-inline-block d-md-none"></i>
                                <span class="d-none d-md-inline-block">Quản lý chủ đề</span>
                            </b-link>
                        </li>
                    </ul>
                </div>
                <b-row class="pt-4">
                    <b-col lg="3">
                        <b-card no-body>
                            <b-card-header class="d-flex align-items-center justify-content-between">
                                <h5 class="card-title m-0">Thông tin</h5>
                                <b-button size="sm"
                                    @click="openUpdateModal"
                                >
                                    <i class="ri-edit-box-line align-bottom"></i>
                                    Cập nhật
                                </b-button>
                            </b-card-header>
                            <b-card-body>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0 text-nowrap" scope="row">Mã giáo trình:</th>
                                                <td style="opacity: 0.6" class="">
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="get(dataDetail, 'data.code', 'Đang cập nhật')" />
                                                    </placeholder-wraper>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0 text-nowrap" scope="row">Tên giáo trình:</th>
                                                <td style="opacity: 0.6" class="">
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text :text="get(dataDetail, 'data.name', 'Đang cập nhật')" />
                                                    </placeholder-wraper>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Trạng thái:</th>
                                                <td style="opacity: 0.6" class="">
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <div class="badge fs-12" :class="get(label_category, `${get(dataDetail, 'data.status')}.class`, 'Đang cập nhật')">
                                                            <Text
                                                                :text="get(label_category, `${get(dataDetail, 'data.status')}.text`, 'Đang cập nhật')" />
                                                        </div>
                                                    </placeholder-wraper>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Ngày tạo:</th>
                                                <td style="opacity: 0.6" class="">
                                                    <placeholder-wraper :isLoading="isLoadingDetail">
                                                        <Text
                                                            :text="moment(get(dataDetail, 'data.created_at') * 1000).format('DD/MM/YYYY')" />
                                                    </placeholder-wraper>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </b-card-body>
                        </b-card>
                   
                        <CardList 
                            class_custom_sub="italic"
                            title="Khóa học" 
                            max_height="170px" link_to_all="/courses" :data="dataCourse" :isLoading="isLoadingDetail"
                        
                        />
                    </b-col>
                    <b-col lg="9" >
                        <div >
                            <fadeContainer>
                                <TabOverview 
                                    :data="dataDetail" 
                                    :isLoadingDetail="isLoadingDetail" 
                                    @reCallAPIGetDataDetail="reCallAPIGetDataDetail"
                                    v-if="tab_session=='overview'"/>
                            </fadeContainer>
                            <TabMangeTopic  v-if="tab_session=='manageTopic'"/>
                        </div>
                    </b-col>
                </b-row>

            </div>
        </b-col>
    </b-row>


    <RightSidebarCreate title="Cập nhật giáo trình / danh mục" :createSidebarModal="isOpenModalUpdate"
        @update:createSidebarModal="isOpenModalUpdate = $event">
        <b-form @submit="onSubmit">
            <div>
                <h6 class="mb-1">Các thông tin cơ bản</h6>
                <p style="opacity: 0.6" class=" mb-4">
                    Nhập các thông tin cơ bản để cập nhật giáo trình
                </p>
            </div>

            <b-form-group id="input-group-name" label="Tên giáo trình:" label-for="input-name">
                <b-form-input 
                    id="input-name" 
                    v-model="form.name" 
                    placeholder="Nhập tên" 
                    required
                    aria-describedby="input-name-feedback" 
                    :class="{ 'is-invalid': v$.form.name.$errors.length>0 }"
                    @input="v$.form.name.$touch" 
                    @blur="v$.form.name.$touch" 
                ></b-form-input>
                <div 
                    class="invalid-feedback" 
                    v-for="(item, index) in v$.form.name.$errors" 
                    :key="index"
                >
            
                    {{ item.$message }}

                </div>
            </b-form-group>
            <b-form-group id="input-group-status" label="Trạng thái:" label-for="input-status">
                <b-form-select 
                  id="input-status"
                  v-model="form.status"
                  :options="status"
                ></b-form-select>
            </b-form-group>
            <b-form-group id="input-group-description" label="Mô tả:" label-for="input-description">
                <b-form-textarea
                    id="textarea"
                    v-model="form.description"
                    placeholder="Mô tả..."
                    rows="3"
                    max-rows="6"
                ></b-form-textarea>
            </b-form-group>
            <ButtonHandle
                type="submit" 
                label="Cập nhật giáo trình" 
                style="cursor:pointer"
                variant="success" 
                :is_disabled="is_disabled"
                :isLoading="isLoadingBtnSubmit" 
            />
  
        </b-form>
    </RightSidebarCreate>

</template>
