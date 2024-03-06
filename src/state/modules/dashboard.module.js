import moment from "moment";
const state = {
    date_range : {
        from: null,
        to: null,
    },
    lable_date_range : 'Tháng ',
    past_range : {
        from: null,
        to: null,
    },
    dimention: 'day',
    zone: 'all', 
};

const mutations = {
    SET_DATE_RANGE(state, date_range) {
        if(!date_range)
        {
            state.date_range = 
            {
                from: null,
                to: null,
            }
            return
        }
        if(date_range == 'week')
        {
            state.lable_date_range = 'Tuần '
            date_range= 'isoWeek'
        }
        else if(date_range == 'month')
        {
            state.lable_date_range = 'Tháng '
        }
        else if(date_range == 'quarter')
        {
            state.lable_date_range = 'Quý '
        }
        else if(date_range == 'year')
        {
            state.lable_date_range = 'Năm '
        }

        state.date_range.from = moment().startOf(date_range).unix()
        state.date_range.to = moment().endOf(date_range).unix()
        state.past_range.from = moment().subtract(1, date_range).startOf(date_range).unix()
        state.past_range.to = moment().subtract(1, date_range).endOf(date_range).unix()
    },

    SET_ZONE(state, zone) {
        state.zone = zone
    },
    SET_COURSES(state, courses) {
        state.courses = courses;
        sessionStorage.setItem("order_create_courses", JSON.stringify(state.courses));
    },

    SET_CUSTOMERS(state, customers) {
        state.customers = customers;
        sessionStorage.setItem("order_create_customers", JSON.stringify(state.customers));
    }   
};

const actions = {
    set_date_range({ commit }, date_range) {
        commit("SET_DATE_RANGE", date_range);
    },

    set_zone({ commit }, zone) {
        commit("SET_ZONE", zone);
    },

    setCourses({ commit }, courses) {
        commit("SET_COURSES", courses);
    },

    setCustomers({ commit }, customers) {
        commit("SET_CUSTOMERS", customers);
    }
};


export default {
    namespaced: true,
    state,
    mutations,
    actions,
}