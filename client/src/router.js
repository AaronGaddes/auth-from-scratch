import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);

function loggedInRedirectDashboard(to, from, next) {
  const token = localStorage.getItem('token');
  if (token) {
    next('/dashboard');
  } else {
    next();
  }
}

function isLoggedIn(to, from, next) {
  const token = localStorage.getItem('token');
  if (token) {
    next();
  } else {
    next('/login');
  }
}

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      beforeEnter: loggedInRedirectDashboard
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: loggedInRedirectDashboard
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: isLoggedIn
    },
  ],
});
