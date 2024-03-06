
import {get} from "../helpers/api/get-data"
import {
    API_GET_REPORT_DASHBOARD_BOX_OVERVIEW,
    API_GET_LIST_TOP5_COURSE_REVENUE,
    API_GET_REPORT_CHART_MAIN,
    API_GET_REPORT_CHART_MAIN_STATISTIC,
} from "../config/api"

import { top_5_course_revenue, data_chart_order } from "../fake_data/course"

class dashboardService {
   static async getReportBoxOverview(query) {
       const res = await get(API_GET_REPORT_CHART_MAIN_STATISTIC, {
           authHeader: true,
           query: query
       }, {},'Server bảo trì', 'public',false)
       return res
   }

   static async getReportChartMainStatistic(query) {
        const res = await get(API_GET_REPORT_CHART_MAIN_STATISTIC, {
            authHeader: true,
            query: query
        }, {},'Server bảo trì', 'public',false)
        return res
    }

    static async getReportChartMain(query) {
        const res = await get(API_GET_REPORT_CHART_MAIN, {
            authHeader: true,
            query: query
        }, {},'Server bảo trì', 'public',false)

        return res}



   static async getListTop5CourseRevenue(query) {
        const res = await get(API_GET_LIST_TOP5_COURSE_REVENUE, {
            authHeader: true,
            query: query
        }, top_5_course_revenue,'Server bảo trì', 'public',false)
        return res
    }



    static async getDataChartOrder(query) {
        const res = await get(API_GET_REPORT_CHART_MAIN, {
            authHeader: true,
            query: query
        }, data_chart_order,'Server bảo trì', 'public',false)
        return res
    }


    static async getstatisticChartOrder(query){
        const res = await get(API_GET_REPORT_CHART_MAIN_STATISTIC, {
            authHeader: true,
            query: query
        }, data_chart_order,'Server bảo trì', 'public',false)
        return res
    }
}
export default dashboardService;