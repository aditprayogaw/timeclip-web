import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import AdminLayout from '../layouts/AdminLayout.vue' // Import layout baru

import HomeView from '../views/marketing/HomeView.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import LoginView from '../views/auth/LoginView.vue'

const routes = [
  // --- MARKETING DOMAIN ---
  { path: '/', name: 'home', component: HomeView },
  { path: '/features', name: 'features', component: () => import('../views/marketing/FeaturesView.vue') },
  { path: '/solutions', name: 'solutions', component: () => import('../views/marketing/SolutionsView.vue') },
  { path: '/pricing', name: 'pricing', component: () => import('../views/marketing/PricingView.vue') },

  // --- AUTH DOMAIN ---
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },

  // --- RESOURCES DOMAIN ---
  { path: '/blog', name: 'blog', component: () => import('../views/resources/BlogView.vue') },
  { path: '/docs', name: 'docs', component: () => import('../views/resources/DocsView.vue') },
  { path: '/support', name: 'support', component: () => import('../views/resources/SupportView.vue') },

  // --- LEGAL DOMAIN ---
  { path: '/privacy-policy', name: 'privacy', component: () => import('../views/legal/PrivacyPolicyView.vue') },
  { path: '/terms-of-service', name: 'terms', component: () => import('../views/legal/TermsOfServiceView.vue') },

  // --- ADMIN DOMAIN (TAMBAHAN DI SINI) ---
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, isAdmin: true, hideNav: true },
    children: [
      {
        path: '',
        redirect: { name: 'AdminDashboard' }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/AdminDashboard.vue')
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: () => import('../views/admin/TransactionView.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/admin/UserManagementView.vue')
      }
    ]
  },

  // --- DASHBOARD DOMAIN ---
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, hideNav: true, isApp: true }
  },
  {
    path: '/dashboard/process/:id',
    name: 'processing',
    component: () => import('../views/dashboard/ProcessingView.vue'),
    meta: { hideNav: true, isApp: true }
  },
  {
    path: '/dashboard/clips/:id',
    name: 'clips-grid',
    component: () => import('../views/dashboard/ClipsGridView.vue'),
    meta: { hideNav: true, isApp: true }
  },
  {
    path: '/dashboard/clips/:id/edit',
    name: 'ClipEditor',
    component: () => import('../views/dashboard/ClipEditor.vue'),
    meta: { hideNav: true, requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  NProgress.start()

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 1. Cek Login
  if (to.meta.requiresAuth && !token) {
    next('/login');
  }
  // 2. Cek Role Admin (Penting!)
  else if (to.meta.isAdmin && user.role !== 'admin') {
    next('/dashboard');
  }
  // 3. Redirect jika sudah login
  else if (token && (to.path === '/login' || to.path === '/register')) {
    next('/dashboard');
  }
  else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done()
})

export default router