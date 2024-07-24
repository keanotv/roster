import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import NewRosterView from '@/views/roster/NewRosterView.vue'
import RosterView from '@/views/roster/RosterView.vue'
import UnavailableDatesView from '@/views/UnavailableDatesView.vue'
import ViewRostersView from '@/views/roster/ViewRostersView.vue'
import {
  path,
  ROUTE_NAMES,
  DEFAULT_TITLE,
  ROSTER_ROUTE_NAMES,
  hyphenate,
  UNAVAILABILITY_ROUTE_NAMES
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
      path: path(ROUTE_NAMES.UNAVAILABILITY),
      children: [
        {
          path: UNAVAILABILITY_ROUTE_NAMES.VIEW,
          component: UnavailabilityView
        },
        {
          path: '',
          name: ROUTE_NAMES.UNAVAILABILITY,
          meta: {
            title: 'Unavailable Dates'
          },
          component: UnavailableDatesView
        }
      ]
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
        { path: ROSTER_ROUTE_NAMES.NEW, component: NewRosterView },
        // { path: ROSTER_ROUTE_NAMES.ARCHIVED, component: HomeView },
        {
          path: ROSTER_ROUTE_NAMES.VIEW,
          children: [
            {
              path: ':id(\\d+)',
              name: hyphenate([ROUTE_NAMES.ROSTER, ROSTER_ROUTE_NAMES.VIEW]),
              component: RosterView,
              props: true
            },
            {
              path: '',
              component: ViewRostersView
            }
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
import { getRosterById } from '@/utils/roster'
import UnavailabilityView from '@/views/roster/UnavailabilityView.vue'

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

router.beforeResolve(async (to) => {
  if (to.name == hyphenate([ROUTE_NAMES.ROSTER, ROSTER_ROUTE_NAMES.VIEW])) {
    if (!Array.isArray(to.params.id)) {
      const id = Number.parseInt(to.params.id)
      await getRosterById(id)
    }
  }
})

export default router
