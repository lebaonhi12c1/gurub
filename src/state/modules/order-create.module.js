const state = {
    courses: JSON.parse(sessionStorage.getItem("order_create_courses")) || [],
    customers: JSON.parse(sessionStorage.getItem("order_create_customers")) || [],
};

const mutations = {
    ADD_COURES(state, courses) {
        state.courses = [
            ...state.courses,
            courses
        ]
        sessionStorage.setItem("order_create_courses", JSON.stringify(state.courses));
    },

    REMOVE_COURES(state, id) {
        state.courses = state.courses.filter(course => course.id !== id);
        sessionStorage.setItem("order_create_courses", JSON.stringify(state.courses));
    },
    SET_COURSES(state, courses) {
        state.courses = courses;
        sessionStorage.setItem("order_create_courses", JSON.stringify(state.courses));
    },

    SET_STUDENTS(state, customers) {
        state.customers = customers;
        sessionStorage.setItem("order_create_customers", JSON.stringify(state.customers));
    }   
};

const actions = {
    addCourse({ commit }, courses) {
        commit("ADD_COURES", courses);
    },

    removeCourse({ commit }, id) {
        commit("REMOVE_COURES", id);
    },

    setCourses({ commit }, courses) {
        commit("SET_COURSES", courses);
    },

    setCustomers({ commit }, customers) {
        commit("SET_STUDENTS", customers);
    }
};


export default {
    namespaced: true,
    state,
    mutations,
    actions,
}