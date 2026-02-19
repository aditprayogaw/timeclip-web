import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress' 

import HomeView from '../views/marketing/HomeView.vue'

const routes = [
  // --- MARKETING DOMAIN ---
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/features',
    name: 'features',
    component: () => import('../views/marketing/FeaturesView.vue')
  },
  {
    path: '/solutions',
    name: 'solutions',
    component: () => import('../views/marketing/SolutionsView.vue')
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('../views/marketing/PricingView.vue')
  },

  // --- AUTH DOMAIN ---
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue')
  },

  // --- RESOURCES DOMAIN ---
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/resources/BlogView.vue')
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('../views/resources/DocsView.vue')
  },
  {
    path: '/support',
    name: 'support',
    component: () => import('../views/resources/SupportView.vue')
  },

  // --- LEGAL DOMAIN ---
  {
    path: '/privacy-policy',
    name: 'privacy',
    component: () => import('../views/legal/PrivacyPolicyView.vue')
  },
  {
    path: '/terms-of-service',
    name: 'terms',
    component: () => import('../views/legal/TermsOfServiceView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Otomatis scroll ke atas saat ganti halaman
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { 
        top: 0, 
        behavior: 'smooth' 
      }
    }
  }
})

// Integrasi NProgress dengan Router Guard
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router