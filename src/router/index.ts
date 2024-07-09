import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PackingView from '@/views/PackingView.vue'
import ProgramView from '@/views/ProgramView.vue'
import MasterclassView from '@/views/MasterclassView.vue'
import LoginView from '@/views/LoginView.vue'
import RosteringView from '@/views/RosteringView.vue'
import NewRosterView from '@/views/roster/NewRosterView.vue'
import RosterView from '@/views/roster/RosterView.vue'
import UnavailabilityView from '@/views/UnavailabilityView.vue'
import {
  path,
  ROUTE_NAMES,
  DEFAULT_TITLE,
  ROSTER_ROUTE_NAMES,
  hyphenate
} from '@/constants/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.HOME,
      component: HomeView,
      meta: {
        title: 'BCM Roster'
      }
    },
    {
      path: path(ROUTE_NAMES.PROGRAM),
      name: ROUTE_NAMES.PROGRAM,
      component: ProgramView,
      meta: {
        title: 'Program'
      }
    },
    {
      path: path(ROUTE_NAMES.MASTERCLASS),
      name: ROUTE_NAMES.MASTERCLASS,
      component: MasterclassView,
      meta: {
        title: 'Masterclass'
      }
    },
    {
      path: path(ROUTE_NAMES.PACKING),
      name: ROUTE_NAMES.PACKING,
      component: PackingView,
      meta: {
        title: 'Packing List'
      }
    },
    {
      path: path(ROUTE_NAMES.UNAVAILABILITY),
      name: ROUTE_NAMES.UNAVAILABILITY,
      component: UnavailabilityView,
      meta: {
        title: 'Unavailable Dates'
      }
    },
    {
      path: path(ROUTE_NAMES.LOGIN),
      name: ROUTE_NAMES.LOGIN,
      component: LoginView,
      meta: {
        title: 'Login'
      }
    },
    {
      path: path(ROUTE_NAMES.ROSTER),
      children: [
        {
          path: '',
          name: ROUTE_NAMES.ROSTER,
          component: RosteringView
        },
        { path: ROSTER_ROUTE_NAMES.NEW, component: NewRosterView },
        { path: ROSTER_ROUTE_NAMES.ARCHIVED, component: PackingView },
        {
          path: ROSTER_ROUTE_NAMES.VIEW,
          children: [
            {
              path: '',
              // name: hyphenate([ROUTE_NAMES.ROSTER, ROSTER_ROUTE_NAMES.VIEW]),
              component: PackingView
            },
            { path: ':id(\\d+)', component: RosterView, props: true }
          ]
        }
      ]
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
import { nextTick } from 'vue'
import { USER_ROLES, useUserStore } from '@/stores/user'

const globalToast = useGlobalToast()

// route validations
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.name === ROUTE_NAMES.LOGOUT) {
    // await userStore.logout()
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
    if (userStore.user.role.some((role) => role === USER_ROLES.ADMIN)) {
      next()
    } else {
      globalToast.info('Sorry, page is not ready!')
      next(from)
    }
  } else next()
})

router.afterEach((to, _from) => {
  nextTick(() => (document.title = (to.meta.title as string) || DEFAULT_TITLE))
})

export default router
