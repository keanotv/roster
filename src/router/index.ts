import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SettingsView from '@/views/SettingsView.vue'
import PackingView from '@/views/PackingView.vue'
import ProgramView from '@/views/ProgramView.vue'
import MasterclassView from '@/views/MasterclassView.vue'
import GameView from '@/views/GameView.vue'
import GameAdminView from '@/views/GameAdminView.vue'
import { path, ROUTE_NAMES, DEFAULT_TITLE } from '@/constants/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.HOME,
      component: HomeView,
      meta: {
        title: 'V Camp 2024',
      }
    },
    {
      path: path(ROUTE_NAMES.PROGRAM),
      name: ROUTE_NAMES.PROGRAM,
      component: ProgramView,
      meta: {
        title: 'V Camp | Program',
      },
    },
    {
      path: path(ROUTE_NAMES.MASTERCLASS),
      name: ROUTE_NAMES.MASTERCLASS,
      component: MasterclassView,
      meta: {
        title: 'V Camp | Masterclass',
      },
    },
    {
      path: path(ROUTE_NAMES.GAME),
      name: ROUTE_NAMES.GAME,
      component: GameView,
      meta: {
        title: 'V Camp | Game',
      },
    },
    {
      path: path(ROUTE_NAMES.PACKING),
      name: ROUTE_NAMES.PACKING,
      component: PackingView,
      meta: {
        title: 'V Camp | Packing List',
      },
    },
    {
      path: path(ROUTE_NAMES.SETTINGS),
      name: ROUTE_NAMES.SETTINGS,
      component: SettingsView,
      meta: {
        requiresAuth: true,
        title: 'V Camp | Settings',
      }
    },
    {
      path: path(ROUTE_NAMES.GAME_ADMIN),
      name: ROUTE_NAMES.GAME_ADMIN,
      component: GameAdminView,
      meta: {
        requiresAuth: true,
        title: 'V Camp | Game Admin',
      },
    },
    {
      path: path(ROUTE_NAMES.LOGOUT),
      name: ROUTE_NAMES.LOGOUT,
      component: HomeView
    },
    {
      path: '/:pathMatch(.*)*',
      name: ROUTE_NAMES.UNKNOWN,
      redirect: '/'
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// toast and toggle dark stuffs
import { useGlobalToast } from '@/utils/toast'
import { USER_ROLES, useUserStore } from '@/stores/user'
import { nextTick } from 'vue'

const globalToast = useGlobalToast()

// route validations
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.name === ROUTE_NAMES.LOGOUT) {
    await userStore.logout()
    next({ name: ROUTE_NAMES.HOME })
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (to.meta.requiresAuth) {
      if (!userStore.user.isLoggedIn) {
        globalToast.info('Log in to view requested page')
        next({ name: ROUTE_NAMES.HOME })
      } else {
        next()
      }
    } else {
      next()
    }
  } else if (to.matched.some((record) => record.meta.wip)) {
    if (userStore.user.role.some(role => role === USER_ROLES.ADMIN)) {
      next()
    } else {
      globalToast.info('Sorry, page is not ready!')
      next(from)
    }
  } else next()
})

router.afterEach((to, _from) => {
  nextTick(() => document.title = to.meta.title as string || DEFAULT_TITLE)
})

export default router
