<script>
import animationData from "@/components/widgets/hzomhqxz.json";
import Lottie from "@/components/widgets/lottie.vue";

export default {
  data() {
    return {
      defaultOptions: {
        animationData: animationData
      },
    };
  },
  components: {
    lottie: Lottie
  },
};
</script>

<template>
  <b-container>
    <b-row>
      <b-col lg="12">
          <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                  <h2 class="text-bold text-light">GURU BOOKING</h2>
              </div>
              <p class="mt-3 fs-15 fw-medium">
                  Trang quản trị chuyên nghiệp
              </p>
          </div>
      </b-col>
  </b-row>

    <b-row class="justify-content-center">
      <b-col md="8" lg="6" xl="5">
        <b-card no-bodyclass="mt-4">
          <b-card-body class="p-4 text-center">
            <lottie colors="primary:#405189,secondary:#08a88a" :options="defaultOptions" :height="180"
              :width="180" />
            <div class="mt-4 pt-2">
              <h5>Bạn đã đăng xuất</h5>
              <p class="text-muted">Cám ơn bạn đã sử dụng <span class="fw-semibold">GURU BOOKING</span></p>
              <div class="mt-4">
                <router-link to="/login" class="btn btn-success w-100">Đăng nhập
                </router-link>
              </div>
            </div>
          </b-card-body>
        </b-card>

      </b-col>
    </b-row>
  </b-container>
</template>