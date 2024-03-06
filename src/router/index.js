import { createWebHistory, createRouter } from "vue-router";
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, left: 0 };
        }
    },
});

router.beforeEach((to, from, next) => {
    const public_pages = [
        'login',
        'forgot-password',
        'forgot-cid',
        'reset-password',
    ];

    const access_token = localStorage.getItem("reset_token");
    const urlParams = new URLSearchParams(window.location.search);
    const accessTokenURL = urlParams.get('reset_token');

    const token = localStorage.getItem('GURUB-TOKEN');
    const authRequired = !public_pages.includes(to.name);

    if (!token) {
        if (!authRequired) {
            if (!access_token && to.name === "reset-password") {
                if (!accessTokenURL) {
                    next({ name: "login" });
                    return;
                }
            }
            next();
        } else {
            next({ name: 'login' });
        }
    } else {
        if (!authRequired) {
            next({ name: 'loading' });
        } else {
            next();
        }
    }
});



router.beforeEach((to, from, next) => {
    const access_token = localStorage.getItem("reset_token");
    const urlParams = new URLSearchParams(window.location.search);
    const accessTokenURL = urlParams.get('reset_token');

    if (!access_token && to.name === "reset-password") {
        if (!accessTokenURL) {
            next({ name: "login" });
            return;
        }
    }

    next();
});

router.beforeEach((to, from, next) => {
    if (to.name != "categories-detail") {
        sessionStorage.removeItem('tab-detail');
        next()
        return
    }

    next()

});


router.beforeResolve(async (to, from, next) => {
    try {
        for (const route of to.matched) {
            await new Promise((resolve, reject) => {
                if (route.meta && route.meta.beforeResolve) {
                    route.meta.beforeResolve(to, from, (...args) => {
                        if (args.length) {
                            next(...args);
                            reject(new Error('Redirected'));
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            });
        }
    } catch (error) {
        return;
    }
    document.title = to.meta.title;
    next();
});

export default router;
