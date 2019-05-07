import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store'

Vue.use(Router);

const authMiddleware = (to, from, next) => {
  if (!store.state.auth.isUserLoggedIn) {
    store.dispatch("auth/logout")
  } else {
    next()
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: authMiddleware
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue'),
      beforeEnter: authMiddleware
    },
  ],
});
